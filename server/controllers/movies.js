const Movie = require('../models/Movie');
const Showtime = require('../models/Showtime');

// Movies
exports.getMovies = async (req, res) => res.json(await Movie.find());
exports.getMovie = async (req, res) => res.json(await Movie.findById(req.params.id));
exports.createMovie = async (req, res) => res.json(await new Movie(req.body).save());
exports.updateMovie = async (req, res) => res.json(await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true }));
exports.deleteMovie = async (req, res) => res.json(await Movie.findByIdAndDelete(req.params.id));

// Showtimes
exports.getShowtimes = async (req, res) => {
    const showtimes = await Showtime.find({ movie: req.params.movieId }).populate('movie');
    res.json(showtimes);
};

exports.getShowtimeById = async (req, res) => {
    try {
        const showtime = await Showtime.findById(req.params.id).populate('movie');
        if (!showtime) return res.status(404).json({ error: 'Showtime not found' });
        res.json(showtime);
    } catch (err) {
        res.status(500).json({ error: 'Server Error' });
    }
};
exports.createShowtime = async (req, res) => res.json(await new Showtime(req.body).save());
exports.deleteShowtime = async (req, res) => res.json(await Showtime.findByIdAndDelete(req.params.id));
