const Booking = require('../models/Booking');
const Showtime = require('../models/Showtime');

exports.createBooking = async (req, res) => {
    const { showtimeId, seats, paymentProvider } = req.body;

    // Mock Payment Logic
    // In real life, we'd call the API here.
    const paymentSuccess = true;
    if (!paymentSuccess) return res.status(400).json({ error: 'Payment Failed' });

    const showtime = await Showtime.findById(showtimeId);

    // Check if seats are taken
    const taken = seats.some(seat => showtime.seats.get(seat) === 'taken');
    if (taken) return res.status(400).json({ error: 'Seat already taken' });

    // Mark seats as taken
    seats.forEach(seat => showtime.seats.set(seat, 'taken'));
    await showtime.save();

    const booking = new Booking({
        user: req.user.id,
        showtime: showtimeId,
        seats,
        totalPrice: seats.length * showtime.price,
        paymentProvider
    });

    await booking.save();
    res.json(booking);
};

exports.getUserBookings = async (req, res) => {
    res.json(await Booking.find({ user: req.user.id }).populate('showtime'));
};
