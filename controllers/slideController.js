const Slide = require('../models/Slide');

// Get all slides
exports.getSlides = async (req, res) => {
  try {
    const slides = await Slide.find().sort({ order: 1 });
    res.status(200).json(slides);
  } catch (error) {
    res.status(500).json({ message: "Error fetching slides", error: error.message });
  }
};

// Create a new slide
exports.createSlide = async (req, res) => {
  try {
    const newSlide = new Slide(req.body);
    const savedSlide = await newSlide.save();
    res.status(201).json(savedSlide);
  } catch (error) {
    res.status(400).json({ message: "Error creating slide", error: error.message });
  }
};