const File = require('../models/File');

exports.getAllFiles = async (req, res) => {
  try {
    const files = await File.find();
    res.json(files);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addFile = async (req, res) => {
  try {
    const file = new File(req.body);
    await file.save();
    res.status(201).json(file);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
