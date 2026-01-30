// const mongoose = require('mongoose');

// const roomCategorySchema = new mongoose.Schema({
//     name: { type: String, required: true,unique: true,trim: true }, // e.g., PREMIUM VALLEY
//     description: { type: String },
//     size: { type: String }, // e.g., 298 sq.ft
//     bedType: { type: String },
//     view: { type: String }, // e.g., Swimming Pool View
//     amenities: [String],    // ["Iron Board", "Room Service"]
//     basePrice: { type: Number, required: true },
//     // Inside the roomCategorySchema
//     ratePlans: [{
//         name: String, // "Breakfast Included", "Half Board", "Room Only"
//         code: String, // "BB", "HB", "RO"
//         extraCharge: Number, // Additional cost per night
//     }],
//     offers: [{
//         offerName: String, // "Happy Hour 2+1"
//         offerCode: String, // "HH21"
//         discountPercentage: Number,
//         isPackageInclusion: Boolean // If true, it's just a label, not a price drop
//     }],
//     inclusions: [String], // ["Complimentary Hi-Tea", "Happy Hour 2+1"]
//     images: [{ type: String, trim: true }]
// },
// images: [{ 
//     type: String, 
//     trim: true 
// }]
//  { timestamps: true });

// module.exports = mongoose.model('RoomCategory', roomCategorySchema);
const mongoose = require('mongoose');

const roomCategorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true, trim: true }, 
    description: { type: String },
    size: { type: String }, 
    bedType: { type: String },
    view: { type: String }, 
    amenities: [String],    
    basePrice: { type: Number, required: true },
    ratePlans: [{
        name: String, 
        code: String, 
        extraCharge: Number, 
    }],
    offers: [{
        offerName: String, 
        offerCode: String, 
        discountPercentage: Number,
        isPackageInclusion: Boolean 
    }],
    inclusions: [String], 
    images: [{ type: String, trim: true }] // Keep this one inside the object
}, { timestamps: true }); // The second argument is the options object

module.exports = mongoose.model('RoomCategory', roomCategorySchema);