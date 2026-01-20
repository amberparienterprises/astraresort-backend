const express = require("express");
const {
  getAllPhotos,
  getPhotoById,
  uploadPhoto,
  deletePhoto,
  getEventsWithFallback
} = require("../controllers/calanderController");

const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

const router = express.Router();

// Public routes
router.get("/", getAllPhotos);
router.get("/:id", getPhotoById);

// Upload (user or admin)
router.post("/", auth, uploadPhoto);

// Admin only
router.delete("/:id", auth, role("admin"), deletePhoto);

module.exports = router;