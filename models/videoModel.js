const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide a video title"],
    trim: true
  },
  youtubeId: {
    type: String,
    required: [true, "YouTube Video ID is required"],
    unique: true
  },
  description: {
    type: String
  },
  category: [{ 
    type: String, 
    required: true, 
    enum: ["Corporate", "Marriage", "Design", "Social", "Suites", "Exterior", "Dining", "Events"],
    default: ["Social"] 
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Video', videoSchema);