const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { validateBooking } = require('../middleware/validation');
const { auth } = require('../middleware/auth'); 




router.post('/', validateBooking, bookingController.createBooking);


router.get('/', auth, bookingController.getAllBookings);


router.get('/:id', auth, bookingController.getBookingById);


router.put('/:id/reschedule', auth, bookingController.rescheduleBooking);


router.put('/:id/cancel', auth, bookingController.cancelBooking);


router.put('/:id/status', auth, bookingController.updateBookingStatus);


router.delete('/:id', auth, bookingController.deleteBooking);


router.get('/calendar/beautician/:beauticianId', auth, bookingController.getBeauticianCalendar);

module.exports = router;
