const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    imageUrl: { type: String, required: true },   // URL of the uploaded photo
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    uploadedByRole: { type: String, enum: ["user", "admin"], default: "user" },
    status: { type: String, enum: ["pending", "published"], default: "pending" },
    yourName: { type: String }, 
  },
  { timestamps: true }
);

module.exports = mongoose.model("Gallery", gallerySchema);
