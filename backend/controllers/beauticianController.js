
exports.getAllLocations = async (req, res) => {
  try {
    const beauticians = await Beautician.find({ isActive: true, onHomeVisit: true })
      .select('name currentLocation email phone');
    res.json({ success: true, locations: beauticians });
  } catch (error) {
    errorHandler(res, 500, 'Error fetching beautician locations', error);
  }
};

exports.updateBeauticianProfile = async (req, res) => {
  try {
    const { certifications, skills, availableSlots } = req.body;
    const beautician = await Beautician.findByIdAndUpdate(
      req.params.id,
      { certifications, skills, availableSlots },
      { new: true, runValidators: true }
    );
    if (!beautician) return errorHandler(res, 404, 'Beautician not found');
    res.json({ success: true, beautician });
  } catch (error) {
    errorHandler(res, 500, 'Error updating beautician profile', error);
  }
};


exports.updateLocation = async (req, res) => {
  try {
    const { lat, lng } = req.body;
    const beautician = await Beautician.findByIdAndUpdate(
      req.params.id,
      { currentLocation: { lat, lng, updatedAt: new Date() } },
      { new: true }
    );
    if (!beautician) return errorHandler(res, 404, 'Beautician not found');
    res.json({ success: true, location: beautician.currentLocation });
  } catch (error) {
    errorHandler(res, 500, 'Error updating location', error);
  }
};


exports.logSafetyCheck = async (req, res) => {
  try {
    const beautician = await Beautician.findByIdAndUpdate(
      req.params.id,
      { lastSafetyCheck: new Date(), onHomeVisit: req.body.onHomeVisit },
      { new: true }
    );
    if (!beautician) return errorHandler(res, 404, 'Beautician not found');
    res.json({ success: true, lastSafetyCheck: beautician.lastSafetyCheck, onHomeVisit: beautician.onHomeVisit });
  } catch (error) {
    errorHandler(res, 500, 'Error logging safety check', error);
  }
};
const Beautician = require('../models/Beautician');
const errorHandler = require('../middleware/errorHandler.js');


exports.getAllBeauticians = async (req, res) => {
  try {
    const beauticians = await Beautician.find({ isActive: true })
      .select('name specialization phone email');

    res.json({
      success: true,
      count: beauticians.length,
      beauticians,
    });
  } catch (error) {
    errorHandler(res, 500, 'Error fetching beauticians', error);
  }
};


exports.getBeauticianById = async (req, res) => {
  try {
    const beautician = await Beautician.findById(req.params.id);
    if (!beautician || !beautician.isActive) {
      return errorHandler(res, 404, 'Beautician not found');
    }
    res.json({ success: true, beautician });
  } catch (error) {
    errorHandler(res, 500, 'Error fetching beautician', error);
  }
};
