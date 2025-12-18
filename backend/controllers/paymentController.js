
exports.getIncomeSummary = async (req, res) => {
  try {
    const { from, to } = req.query;
    const filter = { status: 'PAID' };
    if (from || to) {
      filter.paidAt = {};
      if (from) filter.paidAt.$gte = new Date(from);
      if (to) filter.paidAt.$lte = new Date(to);
    }
    const payments = await Payment.find(filter);
    const totalIncome = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
    res.json({ success: true, totalIncome, count: payments.length, from, to });
  } catch (error) {
    errorHandler(res, 500, 'Error fetching income summary', error);
  }
};

exports.getInvoice = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const booking = await Booking.findById(bookingId).populate('service beautician');
    if (!booking) return errorHandler(res, 404, 'Booking not found');
    const payment = await Payment.findOne({ booking: bookingId });
    
    const invoice = {
      invoiceNumber: payment?.transactionId || `INV-${booking._id}`,
      date: payment?.paidAt || booking.updatedAt,
      client: booking.customerName,
      service: booking.serviceName,
      beautician: booking.beauticianName,
      total: booking.totalPrice,
      paymentStatus: payment?.status || booking.paymentStatus,
      paymentMethod: payment?.method,
    };
    res.json({ success: true, invoice });
  } catch (error) {
    errorHandler(res, 500, 'Error generating invoice', error);
  }
};


exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find().populate('booking');
    res.json({ success: true, payments });
  } catch (error) {
    errorHandler(res, 500, 'Error fetching payments', error);
  }
};
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const errorHandler = require('../middleware/errorHandler.js');
const { sendBookingAndPaymentConfirmation } = require('../config/email');
const { sendPaymentReceiptSMS } = require('../config/sms');


exports.processPayment = async (req, res) => {
  try {
    const { bookingId, method, amount, cardDetails, paymentScreenshot } = req.body;

    
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return errorHandler(res, 404, 'Booking not found');
    }

    
    const existingPayment = await Payment.findOne({ booking: bookingId });
    if (existingPayment) {
      return errorHandler(res, 400, 'Payment already processed for this booking');
    }

    
    const payment = new Payment({
      booking: bookingId,
      amount,
      method,
      status: 'PAID',
      transactionId: `TXN-${Date.now()}`,
      paymentScreenshot,
      cardDetails,
      paidAt: new Date(),
    });

    await payment.save();

    
    booking.paymentStatus = 'paid';
    await booking.save();

    
    try {
      await sendBookingAndPaymentConfirmation({
        email: booking.email,
        serviceName: booking.serviceName,
        date: booking.date,
        time: booking.time,
        beautician: booking.beauticianName,
        address: booking.address,
        totalPrice: booking.totalPrice,
        paymentMethod: method,
        transactionId: payment.transactionId,
      });
    } catch (emailError) {
      console.error('Payment receipt email failed:', emailError);
    }

    
    try {
      if (booking.contactNumber) {
        await sendPaymentReceiptSMS({
          to: booking.contactNumber,
          serviceName: booking.serviceName,
          date: booking.date,
          time: booking.time,
          beautician: booking.beauticianName,
          totalPrice: booking.totalPrice,
          transactionId: payment.transactionId,
        });
      }
    } catch (smsError) {
      console.error('Payment receipt SMS failed:', smsError);
    }

    res.status(201).json({
      success: true,
      message: 'Payment processed and receipt sent',
      payment,
    });
  } catch (error) {
    errorHandler(res, 500, 'Error processing payment', error);
  }
};


exports.getPaymentByBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const payment = await Payment.findOne({ booking: bookingId });

    if (!payment) {
      return errorHandler(res, 404, 'Payment not found');
    }

    res.json({
      success: true,
      payment,
    });
  } catch (error) {
    errorHandler(res, 500, 'Error fetching payment', error);
  }
};