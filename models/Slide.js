const mongoose = require('mongoose');

const SlideSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  highlight: { type: String, required: true },
  desc: { type: String, required: true },
  img: { type: String, required: true },       // Desktop link
  imgMobile: { type: String, required: true }, // Mobile link
  tag: { type: String, required: true },
  order: { type: Number, default: 0 }          // Helps you sort them manually
});

module.exports = mongoose.model('Slide', SlideSchema);