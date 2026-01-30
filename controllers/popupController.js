const Popup = require('../models/Popup');
const { deleteObjectFromS3 } = require('../utils/uploadToS3');

// GET the current active popup (Public)
exports.getPopup = async (req, res) => {
  try {
    const popup = await Popup.findOne();
    res.status(200).json(popup);
  } catch (error) {
    res.status(500).json({ message: "Error fetching popup" });
  }
};

// POST/UPDATE the popup (Admin Only)
exports.uploadPopup = async (req, res) => {
  try {
    const { imageUrl } = req.body;

    // 1. Find the existing popup
    const existingPopup = await Popup.findOne();

    if (existingPopup) {
      // 2. Delete old image from S3 to save space
      if (existingPopup.imageUrl) {
        await deleteObjectFromS3(existingPopup.imageUrl);
      }
      
      // 3. Update the existing record
      existingPopup.imageUrl = imageUrl;
      await existingPopup.save();
      return res.status(200).json(existingPopup);
    }

    // 4. If none exists, create the first one
    const newPopup = await Popup.create({ imageUrl });
    res.status(201).json(newPopup);
  } catch (error) {
    res.status(500).json({ message: "Failed to upload popup", error: error.message });
  }
};
// DELETE the popup (Admin Only)
exports.deletePopup = async (req, res) => {
    try {
      // 1. Find the popup to get the image URL
      const popup = await Popup.findOne();
  
      if (!popup) {
        return res.status(404).json({ message: "No popup found to delete" });
      }
  
      // 2. Delete the image from S3
      if (popup.imageUrl) {
        await deleteObjectFromS3(popup.imageUrl);
      }
  
      // 3. Remove the record from the database
      await Popup.findByIdAndDelete(popup._id);
  
      res.status(200).json({ 
        success: true, 
        message: "Initial load popup and S3 image deleted successfully" 
      });
    } catch (error) {
      res.status(500).json({ message: "Error deleting popup", error: error.message });
    }
  };