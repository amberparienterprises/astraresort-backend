const { initializeInventory } = require('../services/inventoryService');

exports.setupInventory = async (req, res) => {
    try {
        const { roomCategoryId, startDate, endDate, totalRooms, price } = req.body;
        
        const result = await initializeInventory(
            roomCategoryId, 
            startDate, 
            endDate, 
            totalRooms, 
            price
        );

        res.status(200).json({ 
            success: true, 
            message: "Inventory updated successfully", 
            result 
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};