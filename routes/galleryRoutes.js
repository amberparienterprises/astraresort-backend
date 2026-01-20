const express = require("express");
const {
  getAllPhotos,
  getPhotoById,
  uploadPhoto,
  approvePhoto,
  listPendingPhotos,
  listAllPhotos,
  deletePhoto
} = require("../controllers/galleryController");

const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

const router = express.Router();

// Public
router.get("/", getAllPhotos);
router.get("/:id", getPhotoById);

// Upload (admin only)
router.post("/", auth, role("admin"), uploadPhoto);

// Admin only
// router.put("/:id/approve", auth, role("admin"), approvePhoto);
// router.get("/admin/list/pending", auth, role("admin"), listPendingPhotos);
// router.get("/admin/list/all", auth, role("admin"), listAllPhotos);
router.delete("/:id", auth, role("admin"), deletePhoto);

module.exports = router;
