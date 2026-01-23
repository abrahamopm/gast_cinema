const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    poster: String, // URL
    trailer: String, // URL
    featured: { type: Boolean, default: false },
    genre: String,
    duration: Number // in minutes
});

module.exports = mongoose.model('Movie', movieSchema);
