const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/signup/:role', authController.signup);
router.post('/login/:role', authController.login);
router.post('/social-login/:role', authController.socialLogin);

module.exports = router;