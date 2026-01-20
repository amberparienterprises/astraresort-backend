const express = require('express');
const { createEnquiry, getEnquiries, markReviewed } = require('../controllers/enquiryController');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

const router = express.Router();

// Public route
router.post('/', createEnquiry);

// Admin routes
router.get('/', auth, role('admin'), getEnquiries);
router.put('/:id/review', auth, role('admin'), markReviewed);

module.exports = router;
