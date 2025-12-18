const Promo = require('../models/Promo');
const errorHandler = require('../middleware/errorHandler.js');


exports.getAllPromos = async (req, res) => {
  try {
    const now = new Date();
    const promos = await Promo.find({
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now },
    }).sort({ startDate: 1 });

    res.json({
      success: true,
      count: promos.length,
      promos,
    });
  } catch (error) {
    errorHandler(res, 500, 'Error fetching promos', error);
  }
};


exports.getPromoById = async (req, res) => {
  try {
    const promo = await Promo.findById(req.params.id);

    if (!promo || !promo.isActive) {
      return errorHandler(res, 404, 'Promo not found');
    }

    res.json({
      success: true,
      promo,
    });
  } catch (error) {
    errorHandler(res, 500, 'Error fetching promo', error);
  }
};


exports.createPromo = async (req, res) => {
  try {
    const promo = new Promo(req.body);
    await promo.save();

    res.status(201).json({
      success: true,
      message: 'Promo created successfully',
      promo,
    });
  } catch (error) {
    errorHandler(res, 500, 'Error creating promo', error);
  }
};


exports.updatePromo = async (req, res) => {
  try {
    const promo = await Promo.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!promo) {
      return errorHandler(res, 404, 'Promo not found');
    }

    res.json({
      success: true,
      message: 'Promo updated successfully',
      promo,
    });
  } catch (error) {
    errorHandler(res, 500, 'Error updating promo', error);
  }
};


exports.deletePromo = async (req, res) => {
  try {
    const promo = await Promo.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!promo) {
      return errorHandler(res, 404, 'Promo not found');
    }

    res.json({
      success: true,
      message: 'Promo deactivated successfully',
    });
  } catch (error) {
    errorHandler(res, 500, 'Error deleting promo', error);
  }
};