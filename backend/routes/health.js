const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();


router.get('/health', (req, res) => {
  res.json({ dbConnected: mongoose.connection.readyState === 1, state: mongoose.connection.readyState });
});


router.get('/ping', async (req, res) => {
  try {
    const admin = mongoose.connection.db.admin();
    const result = await admin.ping();
    res.json({ ok: result.ok });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
