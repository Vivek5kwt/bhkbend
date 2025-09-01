const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/signup/:role', authController.signup);
router.post('/login/:role', authController.login);

module.exports = router;
