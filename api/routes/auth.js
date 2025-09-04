const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST /api/:role/signup
router.post('/:role/signup', authController.signup);

// POST /api/:role/login
router.post('/:role/login', authController.login);

module.exports = router;
