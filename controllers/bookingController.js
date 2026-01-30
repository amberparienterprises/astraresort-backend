const Booking = require('../models/Booking');
const Inventory = require('../models/Inventory');
const mongoose = require('mongoose');

// Create a new booking with Transaction
exports.createBooking = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { user, roomCategoryId, checkIn, checkOut, totalAmount } = req.body;

        const startDate = new Date(checkIn);
        startDate.setUTCHours(0, 0, 0, 0);
        const endDate = new Date(checkOut);
        endDate.setUTCHours(0, 0, 0, 0);

        const nights = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
        if (nights <= 0) throw new Error("Check-out must be after check-in.");

        // Atomic Inventory Update
        const updateResult = await Inventory.updateMany(
            {
                roomCategoryId: new mongoose.Types.ObjectId(roomCategoryId),
                date: { $gte: startDate, $lt: endDate },
                availableRooms: { $gt: 0 }
            },
            { $inc: { availableRooms: -1 } },
            { session }
        );

        if (updateResult.modifiedCount !== nights) {
            throw new Error(`Booking failed: Expected ${nights} nights available, but found only ${updateResult.modifiedCount}.`);
        }

        // Create Booking Record
        const newBooking = await Booking.create([
            {
                user,
                roomCategory: roomCategoryId, 
                checkIn: startDate,
                checkOut: endDate,
                totalPrice: totalAmount,
                status: 'Confirmed'
            }
        ], { session });

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({ success: true, message: "Booking confirmed!", data: newBooking[0] });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error("Booking Error:", error.message);
        res.status(400).json({ success: false, error: error.message });
    }
};

// Get all bookings for Admin Dashboard
exports.getAllBookings = async (req, res) => {
    try {
        const { view, date } = req.query; // view can be 'arrivals' or 'departures'
        let query = {};

        // Use today's date if no date is provided
        const targetDate = date ? new Date(date) : new Date();
        targetDate.setUTCHours(0, 0, 0, 0);

        if (view === 'arrivals') {
            query.checkIn = targetDate;
        } else if (view === 'departures') {
            query.checkOut = targetDate;
        }

        const bookings = await Booking.find(query)
            .populate('roomCategory', 'name view')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            results: bookings.length,
            view: view || 'all',
            date: targetDate.toISOString().split('T')[0],
            data: bookings
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.updateBookingStatus = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { id } = req.params;
        const { status } = req.body;

        const booking = await Booking.findById(id).session(session);
        if (!booking) throw new Error("Booking not found");

        // IF status is changing TO Cancelled, return the inventory
        if (status === 'Cancelled' && booking.status !== 'Cancelled') {
            const startDate = new Date(booking.checkIn);
            const endDate = new Date(booking.checkOut);

            await Inventory.updateMany(
                {
                    roomCategoryId: booking.roomCategory,
                    date: { $gte: startDate, $lt: endDate }
                },
                { $inc: { availableRooms: 1 } }, // Give the room back
                { session }
            );
        }

        // Update the booking status
        booking.status = status;
        await booking.save({ session });

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({ 
            success: true, 
            message: `Status updated to ${status}`, 
            data: booking 
        });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(400).json({ success: false, error: error.message });
    }
};
// Get bookings for a specific guest by email
exports.getMyBookings = async (req, res) => {
    try {
        const { email } = req.query;

        if (!email) {
            return res.status(400).json({ success: false, error: "Please provide an email address" });
        }

        const bookings = await Booking.find({ "user.email": email })
            .populate('roomCategory', 'name view')
            .sort({ checkIn: -1 });

        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};