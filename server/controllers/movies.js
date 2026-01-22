const Movie = require('../models/Movie');
const Showtime = require('../models/Showtime');

// Movies
exports.getMovies = async (req, res) => res.json(await Movie.find());
exports.getMovie = async (req, res) => res.json(await Movie.findById(req.params.id));
exports.createMovie = async (req, res) => res.json(await new Movie(req.body).save());
exports.deleteMovie = async (req, res) => res.json(await Movie.findByIdAndDelete(req.params.id));

// Showtimes
exports.getShowtimes = async (req, res) => {
    const showtimes = await Showtime.find({ movie: req.params.movieId }).populate('movie');
    res.json(showtimes);
};
exports.createShowtime = async (req, res) => res.json(await new Showtime(req.body).save());
