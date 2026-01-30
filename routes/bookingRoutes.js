const express = require('express');
const router = express.Router();
// Import both functions here
const { createBooking, getAllBookings,updateBookingStatus,getMyBookings} = require('../controllers/bookingController');

// Guest Route
router.post('/checkout', createBooking);

// Admin Route
router.get('/admin/all', getAllBookings);
router.patch('/admin/status/:id', updateBookingStatus);
router.get('/my-bookings', getMyBookings);

module.exports = router;