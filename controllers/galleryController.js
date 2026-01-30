const Gallery = require("../models/Gallery");
const { deleteObjectFromS3 } = require("../utils/uploadToS3");

// Public - list all published photos
exports.getAllPhotos = async (req, res) => {
  try {
    const photos = await Gallery.find({ status: "published" }).sort({ createdAt: -1 });
    res.json(photos);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch photos" });
  }
};

// Single photo by ID
exports.getPhotoById = async (req, res) => {
  try {
    const photo = await Gallery.findOne({ _id: req.params.id, status: "published" });
    if (!photo) return res.status(404).json({ error: "Photo not found" });
    res.json(photo);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch photo" });
  }
};

// Upload photo (admin = published, user = pending)
exports.uploadPhoto = async (req, res) => {
  try {
    // 1. Extract category from body
    const { title, description, imageUrl, yourName, category } = req.body;

    let status = "pending";
    let uploadedByRole = "user";
    let uploadedBy = null;

    if (req.user) {
      uploadedBy = req.user.id;
      uploadedByRole = req.user.role;

      if (req.user.role === "admin") {
        status = "published";
      }
    }

    const photo = new Gallery({
      title,
      description,
      imageUrl,
      category, // 2. Save the category
      yourName,
      uploadedBy,
      uploadedByRole,
      status,
    });

    await photo.save();
    res.status(201).json(photo);
  } catch (err) {
    console.error(err);
    // If user sends a category not in the enum, Mongoose will throw a validation error
    res.status(500).json({ message: "Failed to upload photo", error: err.message });
  }
};

// Admin - approve pending photo
exports.approvePhoto = async (req, res) => {
  try {
    const photo = await Gallery.findByIdAndUpdate(
      req.params.id,
      { status: "published" },
      { new: true }
    );
    res.json(photo);
  } catch (err) {
    res.status(500).json({ message: "Failed to approve photo" });
  }
};

// Admin - list pending
exports.listPendingPhotos = async (req, res) => {
  try {
    const photos = await Gallery.find({ status: "pending" }).sort({ createdAt: -1 });
    res.json(photos);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch pending photos" });
  }
};

// Admin - list all
exports.listAllPhotos = async (req, res) => {
  try {
    const photos = await Gallery.find().sort({ createdAt: -1 });
    res.json(photos);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch all photos" });
  }
};

// Admin - delete photo
exports.deletePhoto = async (req, res) => {
  try {
    const photo = await Gallery.findById(req.params.id);
    
    if (!photo) {
      return res.status(404).json({ message: "Photo not found" });
    }

    // 1. Delete from S3 if imageUrl exists
    if (photo.imageUrl) {
      try {
        await deleteObjectFromS3(photo.imageUrl);
      } catch (s3Err) {
        console.error("S3 Deletion Error:", s3Err);
        // We continue anyway to keep DB and S3 in sync as much as possible
      }
    }

    // 2. Delete from MongoDB
    await Gallery.findByIdAndDelete(req.params.id);

    res.json({ message: "Photo and S3 object deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete photo", error: err.message });
  }
};
