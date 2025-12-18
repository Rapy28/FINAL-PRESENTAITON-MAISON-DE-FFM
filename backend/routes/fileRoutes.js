const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');
const { auth } = require('../middleware/auth');


router.get('/', auth, fileController.getAllFiles); 
router.post('/', auth, fileController.addFile);

module.exports = router;
