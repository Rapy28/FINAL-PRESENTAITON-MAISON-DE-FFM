const express = require('express');
const router = express.Router();
const beauticianController = require('../controllers/beauticianController');


router.get('/', beauticianController.getAllBeauticians);
router.get('/:id', beauticianController.getBeauticianById);

module.exports = router;
