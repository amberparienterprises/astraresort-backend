const express = require('express');
const router = express.Router();
const { getPopup, uploadPopup,deletePopup} = require('../controllers/popupController');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

// Public can view the voucher/popup
router.get('/', getPopup);

// Only Admin can change the voucher/popup
router.post('/', auth, role("admin"), uploadPopup);
router.delete('/', auth, role("admin"), deletePopup);

module.exports = router;