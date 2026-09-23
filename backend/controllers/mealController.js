const Meal = require('../models/Meal');
const FoodItem = require('../models/FoodItem');
const { getLocalDateString } = require('../utils/dateUtils');

// @desc    Add a new meal entry
// @route   POST /api/meals
// @access  Private
const addMeal = async (req, res, next) => {
    try {
        const { foodItemId, mealType, servings, date } = req.body;
        const targetDate = date || getLocalDateString();

        if (servings <= 0) {
            res.status(400);
            throw new Error('Servings must be greater than 0');
        }

        const foodItem = await FoodItem.findById(foodItemId);
        if (!foodItem) {
            res.status(404);
            throw new Error('Food item not found');
        }

        // Calculate snapshot values
        const multiplier = Number(servings);
        const calories = Math.round(foodItem.calories * multiplier);
        const protein = Math.round(foodItem.protein * multiplier);
        const carbohydrates = Math.round(foodItem.carbohydrates * multiplier);
        const fats = Math.round(foodItem.fats * multiplier);
        const fiber = Math.round(foodItem.fiber * multiplier);

        const meal = await Meal.create({
            user: req.user._id,
            foodItem: foodItem._id,
            name: foodItem.name,
            mealType,
            servings: multiplier,
            calories,
            protein,
            carbohydrates,
            fats,
            fiber,
            date: targetDate
        });

        res.status(201).json(meal);
    } catch (error) {
        next(error);
    }
};

// @desc    Get meals for today
// @route   GET /api/meals/today
// @access  Private
const getTodayMeals = async (req, res, next) => {
    try {
        const todayStr = getLocalDateString();
        const meals = await Meal.find({ user: req.user._id, date: todayStr });
        res.json(meals);
    } catch (error) {
        next(error);
    }
};

// @desc    Get meals for a specific date (history)
// @route   GET /api/meals/history
// @access  Private
const getMealHistory = async (req, res, next) => {
    try {
        const { date } = req.query;
        if (!date) {
            res.status(400);
            throw new Error('Date is required');
        }

        const meals = await Meal.find({ user: req.user._id, date });
        res.json(meals);
    } catch (error) {
        next(error);
    }
};

// @desc    Update a meal entry
// @route   PUT /api/meals/:id
// @access  Private
const updateMeal = async (req, res, next) => {
    try {
        const { servings, mealType } = req.body;
        
        const meal = await Meal.findById(req.params.id);

        if (!meal || meal.user.toString() !== req.user._id.toString()) {
            res.status(404);
            throw new Error('Meal not found or unauthorized');
        }

        const foodItem = await FoodItem.findById(meal.foodItem);
        if (!foodItem) {
            res.status(404);
            throw new Error('Associated Food item no longer exists');
        }

        if (mealType) meal.mealType = mealType;
        
        if (servings !== undefined && Number(servings) > 0) {
            const multiplier = Number(servings);
            meal.servings = multiplier;
            meal.calories = Math.round(foodItem.calories * multiplier);
            meal.protein = Math.round(foodItem.protein * multiplier);
            meal.carbohydrates = Math.round(foodItem.carbohydrates * multiplier);
            meal.fats = Math.round(foodItem.fats * multiplier);
            meal.fiber = Math.round(foodItem.fiber * multiplier);
        }

        const updatedMeal = await meal.save();
        res.json(updatedMeal);
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a meal entry
// @route   DELETE /api/meals/:id
// @access  Private
const deleteMeal = async (req, res, next) => {
    try {
        const meal = await Meal.findById(req.params.id);

        if (!meal || meal.user.toString() !== req.user._id.toString()) {
            res.status(404);
            throw new Error('Meal not found or unauthorized');
        }

        await meal.deleteOne();
        res.json({ message: 'Meal removed' });
    } catch (error) {
        next(error);
    }
};

module.exports = { addMeal, getTodayMeals, getMealHistory, updateMeal, deleteMeal };
