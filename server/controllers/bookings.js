const Booking = require('../models/Booking');
const Showtime = require('../models/Showtime');

exports.lockSeats = async (req, res) => {
    const { showtimeId, seats } = req.body;
    const userId = req.user.id;
    const lockDuration = 5 * 60 * 1000; // 5 minutes

    try {
        const showtime = await Showtime.findById(showtimeId);
        if (!showtime) return res.status(404).json({ error: 'Showtime not found' });

        // Check availability
        const unavailable = [];
        seats.forEach(seat => {
            const status = showtime.seats.get(seat);
            const lockedBy = showtime.lockedBy.get(seat);
            const lockExpiry = showtime.lockExpiry.get(seat);

            // If taken, or locked by someone else and not expired
            if (status === 'taken' || (status === 'pending' && lockedBy !== userId && lockExpiry > new Date())) {
                unavailable.push(seat);
            }
        });

        if (unavailable.length > 0) return res.status(409).json({ error: 'Some seats are already taken', seats: unavailable });

        // Apply locks
        seats.forEach(seat => {
            showtime.seats.set(seat, 'pending');
            showtime.lockedBy.set(seat, userId);
            showtime.lockExpiry.set(seat, new Date(Date.now() + lockDuration));
        });

        await showtime.save();
        res.json({ success: true, message: 'Seats locked' });

    } catch (err) {
        res.status(500).json({ error: 'Lock failed' });
    }
};

exports.releaseSeats = async (req, res) => {
    const { showtimeId, seats } = req.body;
    try {
        const showtime = await Showtime.findById(showtimeId);
        if (showtime) {
            seats.forEach(seat => {
                // Only release if locked by this user
                if (showtime.lockedBy.get(seat) === req.user.id) {
                    showtime.seats.delete(seat); // Or set to available if you use 'available' explicitly, but delete works if 'undefined' means available
                    showtime.lockedBy.delete(seat);
                    showtime.lockExpiry.delete(seat);
                }
            });
            await showtime.save();
        }
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Release failed' });
    }
};

exports.createBooking = async (req, res) => {
    if (req.user.role === 'admin') {
        return res.status(403).json({ error: 'Admins cannot book tickets.' });
    }
    const { showtimeId, seats, paymentProvider, phone, idempotencyKey } = req.body;
    const userId = req.user.id;

    // Idempotency check
    if (idempotencyKey) {
        const existing = await Booking.findOne({ idempotencyKey });
        if (existing) return res.json(existing);
    }

    // Mock Payment Logic
    // In real life, we'd call the API here.
    const paymentSuccess = true; // Always true for now as requested

    // In a real atomic transaction, we would start session here
    try {
        const showtime = await Showtime.findById(showtimeId);
        if (!showtime) return res.status(404).json({ error: 'Showtime not found' });

        // Final verification
        const conflict = seats.some(seat => {
            const status = showtime.seats.get(seat);
            const lockedBy = showtime.lockedBy.get(seat);
            // Conflict if taken, or locked by SOMEONE ELSE
            return status === 'taken' || (status === 'pending' && lockedBy && lockedBy !== userId);
        });

        if (conflict) return res.status(409).json({ error: 'Seats no longer available' });

        // Mark definitely taken
        seats.forEach(seat => {
            showtime.seats.set(seat, 'taken');
            showtime.lockedBy.delete(seat);
            showtime.lockExpiry.delete(seat);
        });
        await showtime.save();

        const booking = new Booking({
            user: userId,
            showtime: showtimeId,
            seats,
            totalPrice: seats.length * showtime.price,
            paymentProvider,
            phone,
            status: paymentSuccess ? 'paid' : 'failed',
            idempotencyKey,
            paymentRef: `REF-${Date.now()}`
        });

        await booking.save();
        res.json(booking);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Booking failed' });
    }
};

exports.getUserBookings = async (req, res) => {
    res.json(await Booking.find({ user: req.user.id }).populate('showtime'));
};
