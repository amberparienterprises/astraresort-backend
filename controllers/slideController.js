const Slide = require('../models/Slide');
const { deleteObjectFromS3 } = require("../utils/uploadToS3");

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

    // 1. Find the slide first to get the S3 URLs
    const slide = await Slide.findById(id);

    if (!slide) {
      return res.status(404).json({ message: "Slide not found" });
    }

    // 2. Collect image URLs
    const imagesToDelete = [];
    if (slide.img) imagesToDelete.push(slide.img);
    if (slide.imgMobile) imagesToDelete.push(slide.imgMobile);

    // 3. Delete from S3
    await Promise.allSettled(
      imagesToDelete.map(url => deleteObjectFromS3(url))
    );

    // 4. Delete from MongoDB
    await Slide.findByIdAndDelete(id);

    res.status(200).json({ 
      success: true, 
      message: "Slide and associated desktop/mobile images deleted successfully" 
    });
  } catch (error) {
    console.error("Delete Slide Error:", error);
    res.status(500).json({ message: "Error deleting slide", error: error.message });
  }
};