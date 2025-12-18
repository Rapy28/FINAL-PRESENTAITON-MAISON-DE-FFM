const express = require('express');
const router = express.Router();
const beauticianController = require('../controllers/beauticianController');
const { auth } = require('../middleware/auth');


router.get('/', beauticianController.getAllBeauticians);
router.get('/:id', beauticianController.getBeauticianById);


router.get('/locations/all', auth, beauticianController.getAllLocations);


router.put('/:id/profile', auth, beauticianController.updateBeauticianProfile);
router.put('/:id/location', auth, beauticianController.updateLocation);
router.put('/:id/safety', auth, beauticianController.logSafetyCheck);

module.exports = router;
