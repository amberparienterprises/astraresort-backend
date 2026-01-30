const Video = require('../models/videoModel');

// @desc    Add a new video
// @route   POST /api/videos
exports.createVideo = async (req, res) => {
  try {
    const video = await Video.create(req.body);
    res.status(201).json({ success: true, data: video });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get all videos (can filter by category)
// @route   GET /api/videos
exports.getVideos = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category: category } : {};
    
    const videos = await Video.find(filter).sort('-createdAt');
    res.status(200).json({ success: true, count: videos.length, data: videos });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Delete a video
// @route   DELETE /api/videos/:id
exports.deleteVideo = async (req, res) => {
  try {
    await Video.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Video removed" });
  } catch (error) {
    res.status(404).json({ success: false, message: "Video not found" });
  }
};