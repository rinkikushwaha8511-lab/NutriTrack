const Goal = require('../models/Goal');
const User = require('../models/User');
const { calculateGoals } = require('../utils/calculateGoals');

// @desc    Get user goals
// @route   GET /api/goals
// @access  Private
const getGoals = async (req, res, next) => {
    try {
        const goals = await Goal.findOne({ user: req.user._id });
        if (goals) {
            res.json(goals);
        } else {
            // Return 404 but we could also return empty, 404 is cleaner so UI knows it needs to create one
            res.status(404);
            throw new Error('Goals not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Create or update user goals manually
// @route   PUT /api/goals
// @access  Private
const updateGoals = async (req, res, next) => {
    try {
        const { calories, protein, carbohydrates, fats, water } = req.body;

        let goal = await Goal.findOne({ user: req.user._id });

        if (goal) {
            goal.calories = Number(calories) || goal.calories;
            goal.protein = Number(protein) || goal.protein;
            goal.carbohydrates = Number(carbohydrates) || goal.carbohydrates;
            goal.fats = Number(fats) || goal.fats;
            goal.water = Number(water) || goal.water;

            const updatedGoal = await goal.save();
            res.json(updatedGoal);
        } else {
            // Create new if it doesn't exist
            goal = await Goal.create({
                user: req.user._id,
                calories: Number(calories),
                protein: Number(protein),
                carbohydrates: Number(carbohydrates),
                fats: Number(fats),
                water: Number(water) || 8
            });
            res.status(201).json(goal);
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Auto-calculate and save goals based on user profile
// @route   POST /api/goals/calculate
// @access  Private
const autoCalculateGoals = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        
        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }

        const calculated = calculateGoals(user);

        let goal = await Goal.findOne({ user: req.user._id });

        if (goal) {
            goal.calories = calculated.calories;
            goal.protein = calculated.protein;
            goal.carbohydrates = calculated.carbohydrates;
            goal.fats = calculated.fats;
            goal.water = calculated.water;
            
            const updatedGoal = await goal.save();
            res.json(updatedGoal);
        } else {
            goal = await Goal.create({
                user: req.user._id,
                ...calculated
            });
            res.status(201).json(goal);
        }
    } catch (error) {
        next(error);
    }
};

module.exports = { getGoals, updateGoals, autoCalculateGoals };
