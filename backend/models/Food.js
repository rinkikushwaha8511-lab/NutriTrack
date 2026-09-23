const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' // Links to User model
    },
    foodName: { type: String, required: true },
    mealType: { type: String, required: true, enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack'] },
    quantity: { type: String, required: true },
    calories: { type: Number, required: true },
    protein: { type: Number, required: true },
    carbohydrates: { type: Number, required: true },
    fat: { type: Number, required: true },
    date: { type: String, required: true } // Format: YYYY-MM-DD
}, {
    timestamps: true
});

module.exports = mongoose.model('Food', foodSchema);
