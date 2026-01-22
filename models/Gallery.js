const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    imageUrl: { type: String, required: true },
    // CHANGED: Wrapped in brackets [] to allow multiple categories
    category: [{ 
      type: String, 
      required: true, 
      enum: ["Corporate", "Marriage", "Design", "Social", "Suites", "Exterior", "Dining", "Events"],
      default: ["Social"] 
    }],
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    uploadedByRole: { type: String, enum: ["user", "admin"], default: "user" },
    status: { type: String, enum: ["pending", "published"], default: "pending" },
    yourName: { type: String, required: false }, 
  },
  { timestamps: true }
);

module.exports = mongoose.model("Gallery", gallerySchema);