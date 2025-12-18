const mongoose = require('mongoose');

const InventorySchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  quantity: { type: Number, required: true },
  reorderLevel: { type: Number, required: true },
  cost: { type: Number, required: true }
});

module.exports = mongoose.model('Inventory', InventorySchema);