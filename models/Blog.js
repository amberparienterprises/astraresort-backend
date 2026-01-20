const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  type: { type: String, enum: ['paragraph', 'image', 'heading'], required: true },
  value: { type: String },      // text or image URL
  imageKey: { type: String }    // optional: if stored in S3
});

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  meta: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String],
    image: String
  },
  content: [contentSchema],
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  // ✅ new optional custom name field
  yourName: { type: String }, 

  status: { type: String, enum: ['pending', 'published'], default: 'pending' },
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  submittedByRole: { type: String, enum: ['user', 'admin'], default: 'user' }
}, { timestamps: true });

module.exports = mongoose.model('Blog', blogSchema);
