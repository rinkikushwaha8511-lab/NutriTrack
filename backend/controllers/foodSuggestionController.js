const User = require('../models/User');
const Goal = require('../models/Goal');
const FoodItem = require('../models/FoodItem');
const Meal = require('../models/Meal');
const Food = require('../models/Food');
const { getLocalDateString } = require('../utils/dateUtils');
const { getRecommendations } = require('../utils/foodRecommendation');

// @desc    Get personalized food suggestions
// @route   GET /api/food-suggestions
// @access  Private
const getFoodSuggestions = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const todayStr = getLocalDateString();

        // 1. Fetch User and Goal
        const user = await User.findById(userId).select('-password');
        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }
        
        const goal = await Goal.findOne({ user: userId });

        // 2. Fetch today's intake
        const [meals, legacyFoods] = await Promise.all([
            Meal.find({ user: userId, date: todayStr }),
            Food.find({ user: userId, date: todayStr })
        ]);

        const intake = { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };
        
        meals.forEach(m => {
            intake.calories += m.calories || 0;
            intake.protein += m.protein || 0;
            intake.carbs += m.carbohydrates || 0;
            intake.fat += m.fats || 0;
            intake.fiber += m.fiber || 0;
        });

        legacyFoods.forEach(f => {
            intake.calories += f.calories || 0;
            intake.protein += f.protein || 0;
            intake.carbs += f.carbohydrates || 0;
            intake.fat += f.fat || 0;
        });

        // 3. Fetch all FoodItems
        const allFoods = await FoodItem.find({});

        if (!allFoods || allFoods.length === 0) {
            return res.json({
                goal: user.fitnessGoal,
                dietaryPreference: user.dietaryPreference,
                recommendations: []
            });
        }

        // 4. Calculate Recommendations
        const result = getRecommendations(allFoods, user, goal, intake, 5);

        // 5. Return result
        res.json({
            goal: user.fitnessGoal,
            dietaryPreference: user.dietaryPreference,
            userProfile: result.userProfile,
            mealPlan: result.mealPlan,
            recommendations: result.recommendations
        });

    } catch (error) {
        next(error);
    }
};

module.exports = { getFoodSuggestions };
