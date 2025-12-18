const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { auth } = require('../middleware/auth'); 


router.post('/register', authController.register);
router.post('/login', authController.login);


router.get('/me', auth, authController.getCurrentUser);
router.put('/me/profile', auth, authController.updateProfile);
router.put('/me/preferences', auth, authController.updatePreferences);
router.post('/me/feedback', auth, authController.addFeedback);

module.exports = router;
