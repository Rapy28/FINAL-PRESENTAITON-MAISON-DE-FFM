const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { auth } = require('../middleware/auth');

router.post('/', auth, paymentController.processPayment);
router.get('/', auth, paymentController.getAllPayments);
router.get('/invoice/:bookingId', auth, paymentController.getInvoice);
router.get('/income/summary', auth, paymentController.getIncomeSummary);

module.exports = router;
