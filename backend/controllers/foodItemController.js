const FoodItem = require('../models/FoodItem');

// @desc    Get all foods or search foods
// @route   GET /api/food-items
// @access  Private
const getFoodItems = async (req, res, next) => {
    try {
        const { search, category } = req.query;
        let query = {};

        // Case-insensitive regex search
        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        if (category && category !== 'All Categories') {
            query.category = category;
        }

        const foods = await FoodItem.find(query).sort({ name: 1 });
        res.json(foods);
    } catch (error) {
        next(error);
    }
};

// @desc    Get a single food item
// @route   GET /api/food-items/:id
// @access  Private
const getFoodItemById = async (req, res, next) => {
    try {
        const food = await FoodItem.findById(req.params.id);

        if (food) {
            res.json(food);
        } else {
            res.status(404);
            throw new Error('Food not found');
        }
    } catch (error) {
        next(error);
    }
};

module.exports = { getFoodItems, getFoodItemById };
