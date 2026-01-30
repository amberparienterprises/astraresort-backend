const RoomCategory = require('../models/RoomCategory');
const Inventory = require('../models/Inventory'); // Ensure Inventory is imported
const mongoose = require('mongoose');
// @desc    Create a new room category
// @route   POST /api/rooms
exports.createRoomCategory = async (req, res) => {
    try {
        const room = await RoomCategory.create(req.body);
        res.status(201).json({ success: true, data: room });
    } catch (error) {
        // Check for MongoDB Duplicate Key Error
        if (error.code === 11000) {
            return res.status(400).json({ 
                success: false, 
                error: `A room with the name "${req.body.name}" already exists.` 
            });
        }
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Get all room categories with dynamic details
// @route   GET /api/rooms
exports.getAllRooms = async (req, res) => {
    try {
        const rooms = await RoomCategory.find();
        res.status(200).json({ success: true, count: rooms.length, data: rooms });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Update a room category
// @route   PATCH /api/rooms/:id
exports.updateRoomCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const updatedRoom = await RoomCategory.findByIdAndUpdate(
            id, 
            req.body, 
            { 
                new: true, // Returns the modified document rather than the original
                runValidators: true // Ensures the new data follows your Schema rules
            }
        );

        if (!updatedRoom) {
            return res.status(404).json({ success: false, error: "Room category not found" });
        }

        res.status(200).json({
            success: true,
            message: "Room category updated successfully",
            data: updatedRoom
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ 
                success: false, 
                error: "Another room already has this name." 
            });
        }
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Delete a room category and all its inventory
// @route   DELETE /api/rooms/:id
exports.deleteRoomCategory = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { id } = req.params;

        // 1. Find and delete the room category
        const deletedRoom = await RoomCategory.findByIdAndDelete(id, { session });

        if (!deletedRoom) {
            throw new Error("Room category not found.");
        }

        // 2. Cascading Delete: Remove all inventory associated with this room
        await Inventory.deleteMany({ roomCategoryId: id }, { session });

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({
            success: true,
            message: `Room category "${deletedRoom.name}" and all its associated inventory have been deleted.`
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(400).json({ success: false, error: error.message });
    }
};