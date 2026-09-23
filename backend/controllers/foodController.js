const Food = require('../models/Food');
const { getLocalDateString } = require('../utils/dateUtils');

// @desc    Add a new food entry
// @route   POST /api/foods
// @access  Private
const addFood = async (req, res, next) => {
    try {
        const { foodName, mealType, quantity, calories, protein, carbohydrates, fat, date } = req.body;

        const food = new Food({
            user: req.user._id,
            foodName,
            mealType,
            quantity,
            calories: Number(calories),
            protein: Number(protein),
            carbohydrates: Number(carbohydrates),
            fat: Number(fat),
            date
        });

        const createdFood = await food.save();
        res.status(201).json(createdFood);
    } catch (error) {
        next(error);
    }
};

// @desc    Get foods for today
// @route   GET /api/foods/today
// @access  Private
const getTodayFoods = async (req, res, next) => {
    try {
        const todayStr = getLocalDateString();

        const foods = await Food.find({ user: req.user._id, date: todayStr });
        res.json(foods);
    } catch (error) {
        next(error);
    }
};

// @desc    Get foods for a specific date
// @route   GET /api/foods/date/:date
// @access  Private
const getFoodsByDate = async (req, res, next) => {
    try {
        const foods = await Food.find({ user: req.user._id, date: req.params.date });
        res.json(foods);
    } catch (error) {
        next(error);
    }
};

// @desc    Update a food entry
// @route   PUT /api/foods/:id
// @access  Private
const updateFood = async (req, res, next) => {
    try {
        const food = await Food.findById(req.params.id);

        if (food && food.user.toString() === req.user._id.toString()) {
            food.foodName = req.body.foodName || food.foodName;
            food.mealType = req.body.mealType || food.mealType;
            food.quantity = req.body.quantity || food.quantity;
            food.calories = req.body.calories ? Number(req.body.calories) : food.calories;
            food.protein = req.body.protein ? Number(req.body.protein) : food.protein;
            food.carbohydrates = req.body.carbohydrates ? Number(req.body.carbohydrates) : food.carbohydrates;
            food.fat = req.body.fat ? Number(req.body.fat) : food.fat;
            food.date = req.body.date || food.date;

            const updatedFood = await food.save();
            res.json(updatedFood);
        } else {
            res.status(404).json({ message: 'Food not found or unauthorized' });
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a food entry
// @route   DELETE /api/foods/:id
// @access  Private
const deleteFood = async (req, res, next) => {
    try {
        const food = await Food.findById(req.params.id);

        if (food && food.user.toString() === req.user._id.toString()) {
            await food.deleteOne();
            res.json({ message: 'Food removed' });
        } else {
            res.status(404).json({ message: 'Food not found or unauthorized' });
        }
    } catch (error) {
        next(error);
    }
};

module.exports = { addFood, getTodayFoods, getFoodsByDate, updateFood, deleteFood };
