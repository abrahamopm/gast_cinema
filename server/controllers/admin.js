const Booking = require('../models/Booking');
const Movie = require('../models/Movie');

exports.getStats = async (req, res) => {
    try {
        const totalTickets = await Booking.countDocuments();
        const activeMovies = await Movie.countDocuments();

        const revenueAgg = await Booking.aggregate([
            { $group: { _id: null, total: { $sum: "$totalPrice" } } }
        ]);
        const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].total : 0;

        res.json({
            totalTickets,
            activeMovies,
            totalRevenue
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
