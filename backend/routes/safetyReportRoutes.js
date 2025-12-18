const express = require('express');
const router = express.Router();
const safetyReportController = require('../controllers/safetyReportController');
const { auth } = require('../middleware/auth');

router.get('/', auth, safetyReportController.getAllReports);
router.post('/', auth, safetyReportController.addReport);

module.exports = router;
