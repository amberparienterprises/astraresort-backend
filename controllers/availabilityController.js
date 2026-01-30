const Inventory = require('../models/Inventory');
const RoomCategory = require('../models/RoomCategory');

exports.checkAvailability = async (req, res) => {
    try {
        const { checkIn, checkOut } = req.query;

        if (!checkIn || !checkOut) {
            return res.status(400).json({ success: false, error: "Missing checkIn or checkOut dates" });
        }

        // --- CRITICAL FIX: NORMALIZATION ---
        const startDate = new Date(checkIn);
        startDate.setUTCHours(0, 0, 0, 0);
        const endDate = new Date(checkOut);
        endDate.setUTCHours(0, 0, 0, 0);

        const categories = await RoomCategory.find();
        const totalNightsRequested = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

        const results = await Promise.all(categories.map(async (category) => {
            const days = await Inventory.find({
                roomCategoryId: category._id,
                date: { $gte: startDate, $lt: endDate },
                isBlocked: false
            }).sort({ date: 1 });

            // Check if every night exists in DB and has stock
            const isAvailable = days.length === totalNightsRequested && days.every(day => day.availableRooms > 0);
            
            const baseStayPrice = days.reduce((sum, day) => {
                return sum + (day.priceOverride || category.basePrice);
            }, 0);

            return {
                categoryId: category._id,
                categoryName: category.name,
                roomDetails: {
                    size: category.size,
                    view: category.view,
                    bed: category.bedType
                },
                inclusions: [...category.amenities, ...category.inclusions], 
                rateOptions: category.ratePlans.map(plan => ({
                    planName: plan.name,
                    planCode: plan.code,
                    totalPrice: baseStayPrice + (plan.extraCharge * days.length),
                    offerLabel: "Enjoy Happy Hours with 2+1 offer"
                })),
                isAvailable,
                availableCount: isAvailable ? Math.min(...days.map(d => d.availableRooms)) : 0
            };
        }));

        res.status(200).json({ success: true, data: results });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};