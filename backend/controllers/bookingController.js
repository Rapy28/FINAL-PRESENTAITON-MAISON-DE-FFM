
exports.rescheduleBooking = async (req, res) => {
  try {
    const { date, time } = req.body;
    const booking = await Booking.findById(req.params.id);
    if (!booking) return errorHandler(res, 404, 'Booking not found');
    if (booking.status === 'cancelled' || booking.status === 'completed') {
      return errorHandler(res, 400, 'Cannot reschedule a cancelled or completed booking');
    }
    
    const conflict = await Booking.findOne({
      beautician: booking.beautician,
      date: new Date(date),
      time,
      status: { $in: ['pending', 'confirmed'] },
      _id: { $ne: booking._id }
    });
    if (conflict) return errorHandler(res, 400, 'Time slot unavailable');
    booking.date = new Date(date);
    booking.time = time;
    booking.status = 'pending';
    await booking.save();
    res.json({ success: true, message: 'Booking rescheduled', booking });
  } catch (error) {
    errorHandler(res, 500, 'Error rescheduling booking', error);
  }
};


exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return errorHandler(res, 404, 'Booking not found');
    if (booking.status === 'cancelled') {
      return errorHandler(res, 400, 'Booking already cancelled');
    }
    booking.status = 'cancelled';
    await booking.save();
    res.json({ success: true, message: 'Booking cancelled', booking });
  } catch (error) {
    errorHandler(res, 500, 'Error cancelling booking', error);
  }
};


exports.getBeauticianCalendar = async (req, res) => {
  try {
    const { beauticianId } = req.params;
    const bookings = await Booking.find({ beautician: beauticianId, status: { $in: ['pending', 'confirmed'] } })
      .sort({ date: 1, time: 1 });
    res.json({ success: true, bookings });
  } catch (error) {
    errorHandler(res, 500, 'Error fetching beautician calendar', error);
  }
};
const Booking = require('../models/Booking');
const Service = require('../models/Service');
const { sendBookingConfirmation } = require('../config/email');
const errorHandler = require('../middleware/errorHandler.js');

const Beautician = require('../models/Beautician');


async function assignBeautician({ serviceId, date, time, location }) {
  
  const service = await Service.findById(serviceId);
  if (!service) return null;
  
  const candidates = await Beautician.find({
    isActive: true,
    $or: [
      { specialization: service.name },
      { skills: service.name }
    ]
  });
  
  const available = [];
  for (const b of candidates) {
    
    const conflict = await Booking.findOne({
      beautician: b._id,
      date: new Date(date),
      time,
      status: { $in: ['pending', 'confirmed'] }
    });
    if (conflict) continue;
    
    available.push(b);
  }
  
  if (location && available.length > 1) {
    available.sort((a, b) => {
      if (!a.currentLocation || !b.currentLocation) return 0;
      const d1 = Math.abs(a.currentLocation.lat - location.lat) + Math.abs(a.currentLocation.lng - location.lng);
      const d2 = Math.abs(b.currentLocation.lat - location.lat) + Math.abs(b.currentLocation.lng - location.lng);
      return d1 - d2;
    });
  }
  return available[0] || null;
}


exports.createBooking = async (req, res) => {
  try {
    const {
      customerName,
      phone,
      email,
      date,
      time,
      service,
      beautician,
      address,
      specialRequests,
      homeService,
      location 
    } = req.body;

    
    const bookingDate = new Date(date);
    if (bookingDate < new Date()) {
      return errorHandler(res, 400, 'Booking date cannot be in the past');
    }

    let assignedBeautician = beautician;
    if (!assignedBeautician) {
      
      const found = await assignBeautician({ serviceId: service, date, time, location });
      if (!found) return errorHandler(res, 400, 'No available beautician for this service/time');
      assignedBeautician = found._id;
    }

    
    const existingBooking = await Booking.findOne({
      date: bookingDate,
      time,
      beautician: assignedBeautician,
      status: { $in: ['pending', 'confirmed'] },
    });
    if (existingBooking) {
      return errorHandler(res, 400, 'This time slot is already booked');
    }

    
    const serviceDetails = await Service.findById(service);
    if (!serviceDetails || !serviceDetails.isActive) {
      return errorHandler(res, 404, 'Service not found or unavailable');
    }

    
    const beauticianDoc = await Beautician.findById(assignedBeautician);
    if (!beauticianDoc) return errorHandler(res, 404, 'Beautician not found');

    
    const homeServiceFee = homeService ? 200 : 0;
    const totalPrice = serviceDetails.price + homeServiceFee;

    
    const booking = new Booking({
      customerName,
      phone,
      email,
      date: bookingDate,
      time,
      service,
      serviceName: serviceDetails.name,
      price: serviceDetails.price,
      beautician: assignedBeautician,
      beauticianName: beauticianDoc.name,
      address,
      specialRequests,
      homeServiceFee,
      totalPrice,
    });

    await booking.save();

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      booking: {
        id: booking._id,
        customerName: booking.customerName,
        serviceName: booking.serviceName,
        date: booking.date,
        time: booking.time,
        beautician: booking.beautician,
        beauticianName: booking.beauticianName,
        totalPrice: booking.totalPrice,
        status: booking.status,
      },
    });
  } catch (error) {
    errorHandler(res, 500, 'Error creating booking', error);
  }
};


exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('service', 'name category price')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    errorHandler(res, 500, 'Error fetching bookings', error);
  }
};


exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('service', 'name category price description');

    if (!booking) {
      return errorHandler(res, 404, 'Booking not found');
    }

    res.json({
      success: true,
      booking,
    });
  } catch (error) {
    errorHandler(res, 500, 'Error fetching booking', error);
  }
};


exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!booking) {
      return errorHandler(res, 404, 'Booking not found');
    }

    res.json({
      success: true,
      message: 'Booking status updated',
      booking,
    });
  } catch (error) {
    errorHandler(res, 500, 'Error updating booking status', error);
  }
};


exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);

    if (!booking) {
      return errorHandler(res, 404, 'Booking not found');
    }

    res.json({
      success: true,
      message: 'Booking deleted successfully',
    });
  } catch (error) {
    errorHandler(res, 500, 'Error deleting booking', error);
  }
};