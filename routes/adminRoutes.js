const express = require('express');
const router = express.Router();
const { setupInventory } = require('../controllers/adminController');

// In a real app, you would add Admin Middleware here for security
router.post('/init-inventory', setupInventory);

module.exports = router;