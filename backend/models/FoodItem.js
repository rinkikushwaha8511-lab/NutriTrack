const mongoose = require('mongoose');

const foodItemSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    category: { 
        type: String, 
        required: true,
        trim: true
    },
    calories: { type: Number, required: true, min: 0 },
    protein: { type: Number, required: true, min: 0 },
    carbohydrates: { type: Number, required: true, min: 0 },
    fats: { type: Number, required: true, min: 0 },
    fiber: { type: Number, required: true, min: 0 },
    servingSize: { type: Number, required: true, min: 0 },
    servingUnit: { type: String, required: true }
}, {
    timestamps: true
});

module.exports = mongoose.model('FoodItem', foodItemSchema);
