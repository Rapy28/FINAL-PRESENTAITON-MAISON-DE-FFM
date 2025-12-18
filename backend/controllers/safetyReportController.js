const SafetyReport = require('../models/SafetyReport');

exports.getAllReports = async (req, res) => {
  try {
    const reports = await SafetyReport.find();
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addReport = async (req, res) => {
  try {
    const report = new SafetyReport(req.body);
    await report.save();
    res.status(201).json(report);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
