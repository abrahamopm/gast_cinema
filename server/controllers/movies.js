const Movie = require('../models/Movie');
const Showtime = require('../models/Showtime');
const { sendJSON, sendError } = require('../utils/httpHelpers');

// Movies
exports.getMovies = async (req, res) => sendJSON(res, 200, await Movie.find());
exports.getMovie = async (req, res) => sendJSON(res, 200, await Movie.findById(req.params.id));
exports.createMovie = async (req, res) => sendJSON(res, 200, await new Movie(req.body).save());
exports.updateMovie = async (req, res) => sendJSON(res, 200, await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true }));
exports.deleteMovie = async (req, res) => sendJSON(res, 200, await Movie.findByIdAndDelete(req.params.id));

// Showtimes
exports.getShowtimes = async (req, res) => {
    const showtimes = await Showtime.find({ movie: req.params.movieId }).populate('movie');
    sendJSON(res, 200, showtimes);
};

exports.getShowtimeById = async (req, res) => {
    try {
        const showtime = await Showtime.findById(req.params.id).populate('movie');
        if (!showtime) return sendError(res, 404, 'Showtime not found');
        sendJSON(res, 200, showtime);
    } catch (err) {
        sendError(res, 500, 'Server Error');
    }
};
exports.createShowtime = async (req, res) => sendJSON(res, 200, await new Showtime(req.body).save());
exports.deleteShowtime = async (req, res) => sendJSON(res, 200, await Showtime.findByIdAndDelete(req.params.id));
