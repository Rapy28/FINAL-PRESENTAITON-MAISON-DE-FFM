const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const { auth } = require('../middleware/auth');

router.get('/', auth, inventoryController.getAllInventory);
router.post('/', auth, inventoryController.addInventoryItem);
router.put('/:id', auth, inventoryController.updateInventoryItem);
router.delete('/:id', auth, inventoryController.deleteInventoryItem);
router.get('/alerts/low', auth, inventoryController.getLowInventory);

module.exports = router;
