const mongoose = require('mongoose');

const popupSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  link: { type: String } // Optional: where the voucher leads to
}, { timestamps: true });

module.exports = mongoose.model('Popup', popupSchema);