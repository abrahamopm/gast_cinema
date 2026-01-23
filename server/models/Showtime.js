const mongoose = require('mongoose');

const showtimeSchema = new mongoose.Schema({
    movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
    date: { type: String, required: true }, // Simple string for simplicity YYYY-MM-DD
    time: { type: String, required: true },
    hall: { type: String, required: true, default: 'Standard Hall' },
    price: { type: Number, required: true },
    seats: {
        type: Map,
        of: String, // Key: SeatID (A1), Value: 'available' | 'taken' 
        default: {}
    }
});

module.exports = mongoose.model('Showtime', showtimeSchema);
