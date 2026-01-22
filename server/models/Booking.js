const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    showtime: { type: mongoose.Schema.Types.ObjectId, ref: 'Showtime', required: true },
    seats: [String],
    totalPrice: Number,
    paymentProvider: String,
    phone: String,
    status: { type: String, default: 'Confirmed' }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
