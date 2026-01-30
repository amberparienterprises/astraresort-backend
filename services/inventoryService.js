const Inventory = require('../models/Inventory');
const mongoose = require('mongoose');

exports.initializeInventory = async (roomCategoryId, startDate, endDate, totalRooms, price) => {
    // 1. Normalize Start and End to Midnight UTC
    const start = new Date(startDate);
    start.setUTCHours(0, 0, 0, 0);
    
    const end = new Date(endDate);
    end.setUTCHours(0, 0, 0, 0);

    const inventoryDocs = [];

    // Loop through every day
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        inventoryDocs.push({
            // 2. CRITICAL: Normalize each daily date to Midnight UTC
            date: new Date(d.setUTCHours(0, 0, 0, 0)),
            // 3. CRITICAL: Ensure ID is a MongoDB ObjectId, not a string
            roomCategoryId: new mongoose.Types.ObjectId(roomCategoryId),
            totalRooms: Number(totalRooms),
            availableRooms: Number(totalRooms),
            priceOverride: Number(price)
        });
    }

    // 4. Perform the Bulk Write
    return await Inventory.bulkWrite(
        inventoryDocs.map(doc => ({
            updateOne: {
                // Match by exact Date (Midnight) and exact ObjectId
                filter: { date: doc.date, roomCategoryId: doc.roomCategoryId },
                update: { $set: doc },
                upsert: true 
            }
        }))
    );
};