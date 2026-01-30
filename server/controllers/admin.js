const Booking = require('../models/Booking');
const Movie = require('../models/Movie');
const { sendJSON, sendError } = require('../utils/httpHelpers');

exports.getStats = async (req, res) => {
    try {
        const totalTickets = await Booking.countDocuments();
        const activeMovies = await Movie.countDocuments();

        const revenueAgg = await Booking.aggregate([
            { $group: { _id: null, total: { $sum: "$totalPrice" } } }
        ]);
        const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].total : 0;

        sendJSON(res, 200, {
            totalTickets,
            activeMovies,
            totalRevenue
        });
    } catch (err) {
        sendError(res, 500, err.message);
    }
};
