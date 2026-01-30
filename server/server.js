const http = require('http');
const mongoose = require('mongoose');
const url = require('url');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const { parseBody, sendJSON, sendError } = require('./utils/httpHelpers');

// Controllers
const authController = require('./controllers/auth');
const moviesController = require('./controllers/movies');
const bookingsController = require('./controllers/bookings');
const adminController = require('./controllers/admin');

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.error('❌ DB Connection Error:', err));

// Auth Helper
const authenticate = (req) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) throw { status: 401, message: 'Access Denied' };

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
    } catch (err) {
        throw { status: 400, message: 'Invalid Token' };
    }
};

const server = http.createServer(async (req, res) => {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        return res.end();
    }

    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    req.query = parsedUrl.query;

    // Body Parsing
    if (['POST', 'PUT'].includes(req.method)) {
        try {
            req.body = await parseBody(req);
        } catch (err) {
            return sendError(res, 400, 'Invalid JSON body');
        }
    }

    // Router
    try {
        // --- Auth Routes ---
        if (path === '/api/auth/register' && req.method === 'POST') {
            return await authController.register(req, res);
        }
        if (path === '/api/auth/login' && req.method === 'POST') {
            return await authController.login(req, res);
        }
        if (path === '/api/auth/password' && req.method === 'POST') {
            authenticate(req);
            return await authController.changePassword(req, res);
        }

        // --- Movie Routes ---
        // GET /api/movies
        if (path === '/api/movies' && req.method === 'GET') {
            return await moviesController.getMovies(req, res);
        }
        // POST /api/movies (Protected)
        if (path === '/api/movies' && req.method === 'POST') {
            authenticate(req);
            return await moviesController.createMovie(req, res);
        }
        // GET /api/movies/:id
        let match = path.match(/^\/api\/movies\/([a-f0-9]+)$/);
        if (match && req.method === 'GET') {
            req.params = { id: match[1] };
            return await moviesController.getMovie(req, res);
        }
        // PUT /api/movies/:id (Protected)
        if (match && req.method === 'PUT') {
            authenticate(req);
            req.params = { id: match[1] };
            return await moviesController.updateMovie(req, res);
        }
        // DELETE /api/movies/:id (Protected)
        if (match && req.method === 'DELETE') {
            authenticate(req);
            req.params = { id: match[1] };
            return await moviesController.deleteMovie(req, res);
        }

        // --- Showtimes Routes ---
        // GET /api/movies/:movieId/showtimes
        match = path.match(/^\/api\/movies\/([a-f0-9]+)\/showtimes$/);
        if (match && req.method === 'GET') {
            req.params = { movieId: match[1] };
            return await moviesController.getShowtimes(req, res);
        }
        // GET /api/showtimes/:id
        match = path.match(/^\/api\/showtimes\/([a-f0-9]+)$/);
        if (match && req.method === 'GET') {
            req.params = { id: match[1] };
            return await moviesController.getShowtimeById(req, res);
        }
        // POST /api/showtimes (Protected)
        if (path === '/api/showtimes' && req.method === 'POST') {
            authenticate(req);
            return await moviesController.createShowtime(req, res);
        }
        // DELETE /api/showtimes/:id (Protected)
        match = path.match(/^\/api\/showtimes\/([a-f0-9]+)$/);
        if (match && req.method === 'DELETE') {
            authenticate(req);
            req.params = { id: match[1] };
            return await moviesController.deleteShowtime(req, res);
        }

        // --- Admin Routes ---
        if (path === '/api/admin/stats' && req.method === 'GET') {
            authenticate(req);
            return await adminController.getStats(req, res);
        }

        // --- Booking Routes ---
        if (path === '/api/bookings' && req.method === 'POST') {
            authenticate(req);
            return await bookingsController.createBooking(req, res);
        }
        if (path === '/api/bookings/lock' && req.method === 'POST') {
            authenticate(req);
            return await bookingsController.lockSeats(req, res);
        }
        if (path === '/api/bookings/release' && req.method === 'POST') {
            authenticate(req);
            return await bookingsController.releaseSeats(req, res);
        }
        if (path === '/api/bookings' && req.method === 'GET') {
            authenticate(req);
            return await bookingsController.getUserBookings(req, res);
        }

        // 404
        sendError(res, 404, 'Route not found');

    } catch (err) {
        if (err.status) {
            sendError(res, err.status, err.message);
        } else {
            console.error(err);
            sendError(res, 500, 'Server Error');
        }
    }
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 (MRN) Server running on port ${PORT}`));
