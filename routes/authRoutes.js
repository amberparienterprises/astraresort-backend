const express = require('express');
const { register, login } = require('../controllers/authController');
const router = express.Router();

router.post('/register', express.json(), register);
router.post('/login', express.json(), login);

module.exports = router;
