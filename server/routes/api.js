const router = require('express').Router();
const auth = require('../controllers/auth');
const movies = require('../controllers/movies');
const bookings = require('../controllers/bookings');
const verify = require('../middleware/auth');

// Auth
router.post('/auth/register', auth.register);
router.post('/auth/login', auth.login);

// Movies
router.get('/movies', movies.getMovies);
router.get('/movies/:id', movies.getMovie);
router.post('/movies', verify, movies.createMovie); // Protect admin routes in real app
router.delete('/movies/:id', verify, movies.deleteMovie);

// Showtimes
router.get('/movies/:movieId/showtimes', movies.getShowtimes);
router.post('/showtimes', verify, movies.createShowtime);

// Bookings
router.post('/bookings', verify, bookings.createBooking);
router.get('/bookings', verify, bookings.getUserBookings);

module.exports = router;
