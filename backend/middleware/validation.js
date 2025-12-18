exports.validateBooking = (req, res, next) => {
  const { userId, serviceId, date } = req.body;
  if (!userId || !serviceId || !date) {
    return res.status(400).json({ success: false, message: 'Missing booking fields: userId, serviceId, date are required' });
  }
  next();
};
