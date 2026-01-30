const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
    date: { 
        type: Date, 
        required: true 
    },
    roomCategoryId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'RoomCategory', 
        required: true 
    },
    totalRooms: { 
        type: Number, 
        required: true 
    }, // Total units the resort has for this type
    availableRooms: { 
        type: Number, 
        required: true 
    }, // Remaining units for this specific date
    priceOverride: { 
        type: Number 
    }, // If admin sets a special price for this date
    isBlocked: { 
        type: Boolean, 
        default: false 
    } // Admin can manually block all rooms for a wedding/event
}, { timestamps: true });

// Ensure we don't have duplicate entries for the same room on the same day
inventorySchema.index({ date: 1, roomCategoryId: 1 }, { unique: true });

module.exports = mongoose.model('Inventory', inventorySchema);