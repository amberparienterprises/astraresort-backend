
// Updated Mongoose Schema
const mongoose = require("mongoose");

const calanderSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    imageUrl: { type: String, required: true },   
    yourName: { type: String }, 
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    uploadedByRole: { type: String, enum: ["user", "admin"], default: "user" },
    status: { type: String, enum: ["pending", "published"], default: "pending" },
    fromdate: { type: Date, required: true }, // Changed to Date type
    todate: { type: Date },   // Changed to Date type
    location: { type: String } // Added location field
  },
  { timestamps: true } // This adds createdAt and updatedAt
);

module.exports = mongoose.model("Calander", calanderSchema);