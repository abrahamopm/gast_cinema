const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    showtime: { type: mongoose.Schema.Types.ObjectId, ref: 'Showtime', required: true },
    seats: [String],
    totalPrice: Number,
    paymentProvider: String,
    phone: String,
    status: { type: String, enum: ['pending', 'paid', 'failed', 'cancelled'], default: 'confirmed' }, // Default confirmed for backward compatibility with mock
    paymentRef: String,
    idempotencyKey: { type: String, unique: true, sparse: true }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
