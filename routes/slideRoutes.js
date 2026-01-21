const express = require('express');
const router = express.Router();
const slideController = require('../controllers/slideController');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

// Route to get slides (Public)
router.get('/', slideController.getSlides);

// Route to add a slide (Admin only)
router.post('/', auth, role("admin"), slideController.createSlide);

// Route to delete a slide (Admin only)
// Matches: DELETE /api/slides/:id
router.delete('/:id', auth, role("admin"), slideController.deleteSlide);

module.exports = router;