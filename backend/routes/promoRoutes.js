const express = require('express');
const router = express.Router();
const promoController = require('../controllers/promoController');
const { auth } = require('../middleware/auth');


router.get('/', promoController.getAllPromos);
router.get('/:id', promoController.getPromoById);






module.exports = router;
