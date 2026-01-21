const express = require('express');
const router = express.Router();
const slideController = require('../controllers/slideController');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

// Route to get slides
router.get('/', slideController.getSlides);

// Route to add a slide
router.post('/',auth,role("admin"), slideController.createSlide);

module.exports = router;