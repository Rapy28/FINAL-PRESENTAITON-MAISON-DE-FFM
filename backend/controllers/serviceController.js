
exports.createService = async (req, res) => {
  try {
    const { name, category, description, price, duration } = req.body;
    const service = new Service({ name, category, description, price, duration });
    await service.save();
    res.status(201).json({ success: true, service });
  } catch (error) {
    errorHandler(res, 500, 'Error creating service', error);
  }
};


exports.updateService = async (req, res) => {
  try {
    const { name, category, description, price, duration, isActive } = req.body;
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      { name, category, description, price, duration, isActive },
      { new: true, runValidators: true }
    );
    if (!service) return errorHandler(res, 404, 'Service not found');
    res.json({ success: true, service });
  } catch (error) {
    errorHandler(res, 500, 'Error updating service', error);
  }
};


exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) return errorHandler(res, 404, 'Service not found');
    res.json({ success: true, message: 'Service deleted' });
  } catch (error) {
    errorHandler(res, 500, 'Error deleting service', error);
  }
};
const Service = require('../models/Service');
const errorHandler = require('../middleware/errorHandler.js');


exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find({ isActive: true }).sort({ category: 1, name: 1 });
    
    
    const servicesByCategory = services.reduce((acc, service) => {
      if (!acc[service.category]) {
        acc[service.category] = [];
      }
      acc[service.category].push({
        id: service._id,
        name: service.name,
        price: service.price,
        duration: service.duration,
        description: service.description,
      });
      return acc;
    }, {});

    res.json({
      success: true,
      servicesByCategory,
    });
  } catch (error) {
    errorHandler(res, 500, 'Error fetching services', error);
  }
};


exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service || !service.isActive) {
      return errorHandler(res, 404, 'Service not found');
    }

    res.json({
      success: true,
      service,
    });
  } catch (error) {
    errorHandler(res, 500, 'Error fetching service', error);
  }
};


exports.createService = async (req, res) => {
  try {
    const service = new Service(req.body);
    await service.save();

    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      service,
    });
  } catch (error) {
    errorHandler(res, 500, 'Error creating service', error);
  }
};


exports.updateService = async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!service) {
      return errorHandler(res, 404, 'Service not found');
    }

    res.json({
      success: true,
      message: 'Service updated successfully',
      service,
    });
  } catch (error) {
    errorHandler(res, 500, 'Error updating service', error);
  }
};


exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!service) {
      return errorHandler(res, 404, 'Service not found');
    }

    res.json({
      success: true,
      message: 'Service deactivated successfully',
    });
  } catch (error) {
    errorHandler(res, 500, 'Error deleting service', error);
  }
};