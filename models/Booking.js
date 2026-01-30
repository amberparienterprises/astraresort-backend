const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    user: {
        name: String,
        email: String,
        phone: String
    },
    roomCategory: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'RoomCategory', 
        required: true 
    },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    totalPrice: { type: Number, required: true },
    status: { 
        type: String, 
        enum: ['Pending', 'Confirmed', 'Checked-In', 'Checked-Out', 'Cancelled'], 
        default: 'Confirmed' // Changed to Confirmed since your checkout goes straight to success
    },
    paymentId: String // For future payment gateway integration
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);