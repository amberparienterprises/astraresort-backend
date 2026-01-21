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

exports.deleteSlide = async (req, res) => {
    try {
      const { id } = req.params;
      const deletedSlide = await Slide.findByIdAndDelete(id);
  
      if (!deletedSlide) {
        return res.status(404).json({ message: "Slide not found" });
      }
  
      res.status(200).json({ message: "Slide deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting slide", error: error.message });
    }
  };