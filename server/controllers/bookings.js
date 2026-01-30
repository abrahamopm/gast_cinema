const Booking = require('../models/Booking');
const Showtime = require('../models/Showtime');
const { sendJSON, sendError } = require('../utils/httpHelpers');

exports.lockSeats = async (req, res) => {
    const { showtimeId, seats } = req.body;
    const userId = req.user.id;
    const lockDuration = 5 * 60 * 1000; // 5 minutes

    try {
        const showtime = await Showtime.findById(showtimeId);
        if (!showtime) return sendError(res, 404, 'Showtime not found');

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

        if (unavailable.length > 0) return sendJSON(res, 409, { error: 'Some seats are already taken', seats: unavailable });

        // Apply locks
        seats.forEach(seat => {
            showtime.seats.set(seat, 'pending');
            showtime.lockedBy.set(seat, userId);
            showtime.lockExpiry.set(seat, new Date(Date.now() + lockDuration));
        });

        await showtime.save();
        sendJSON(res, 200, { success: true, message: 'Seats locked' });

    } catch (err) {
        sendError(res, 500, 'Lock failed');
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
                    showtime.seats.delete(seat);
                    showtime.lockedBy.delete(seat);
                    showtime.lockExpiry.delete(seat);
                }
            });
            await showtime.save();
        }
        sendJSON(res, 200, { success: true });
    } catch (err) {
        sendError(res, 500, 'Release failed');
    }
};

exports.createBooking = async (req, res) => {
    if (req.user.role === 'admin') {
        return sendError(res, 403, 'Admins cannot book tickets.');
    }
    const { showtimeId, seats, paymentProvider, phone, idempotencyKey } = req.body;
    const userId = req.user.id;

    // Idempotency check
    if (idempotencyKey) {
        const existing = await Booking.findOne({ idempotencyKey });
        if (existing) return sendJSON(res, 200, existing);
    }

    const paymentSuccess = true;

    try {
        const showtime = await Showtime.findById(showtimeId);
        if (!showtime) return sendError(res, 404, 'Showtime not found');

        // Final verification
        const conflict = seats.some(seat => {
            const status = showtime.seats.get(seat);
            const lockedBy = showtime.lockedBy.get(seat);
            return status === 'taken' || (status === 'pending' && lockedBy && lockedBy !== userId);
        });

        if (conflict) return sendError(res, 409, 'Seats no longer available');

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
        sendJSON(res, 200, booking);
    } catch (err) {
        console.error(err);
        sendError(res, 500, 'Booking failed');
    }
};

exports.getUserBookings = async (req, res) => {
    sendJSON(res, 200, await Booking.find({ user: req.user.id }).populate('showtime'));
};
