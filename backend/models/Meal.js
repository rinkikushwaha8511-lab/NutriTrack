const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    foodItem: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'FoodItem'
    },
    name: { type: String, required: true },
    mealType: { type: String, required: true, enum: ['Breakfast', 'Lunch', 'Dinner', 'Snacks'] },
    servings: { type: Number, required: true, min: 0.1 },
    calories: { type: Number, required: true },
    protein: { type: Number, required: true },
    carbohydrates: { type: Number, required: true },
    fats: { type: Number, required: true },
    fiber: { type: Number, required: true },
    date: { type: String, required: true } // Format: YYYY-MM-DD
}, {
    timestamps: true
});

module.exports = mongoose.model('Meal', mealSchema);
