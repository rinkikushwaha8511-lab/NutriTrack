const Food = require('../models/Food');
const Meal = require('../models/Meal');
const Water = require('../models/Water');
const Goal = require('../models/Goal');
const User = require('../models/User');
const { getLocalDateString } = require('../utils/dateUtils');

// @desc    Get dashboard summary for today
// @route   GET /api/dashboard
// @access  Private
const getDashboardSummary = async (req, res, next) => {
    try {
        const todayStr = getLocalDateString();
        const userId = req.user._id;

        // Fetch User and Goals concurrently
        const [user, goal, foods, meals, waterEntries] = await Promise.all([
            User.findById(userId).select('-password'),
            Goal.findOne({ user: userId }),
            Food.find({ user: userId, date: todayStr }),
            Meal.find({ user: userId, date: todayStr }),
            Water.find({ user: userId, date: todayStr })
        ]);

        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }

        // Calculate totals
        let totalCalories = 0;
        let totalProtein = 0;
        let totalCarbs = 0;
        let totalFat = 0;
        let totalFiber = 0;

        foods.forEach(food => {
            totalCalories += food.calories || 0;
            totalProtein += food.protein || 0;
            totalCarbs += food.carbohydrates || 0;
            totalFat += food.fat || 0;
        });

        meals.forEach(meal => {
            totalCalories += meal.calories || 0;
            totalProtein += meal.protein || 0;
            totalCarbs += meal.carbohydrates || 0;
            totalFat += meal.fats || 0;
            totalFiber += meal.fiber || 0;
        });

        const combinedList = [
            ...foods.map(f => ({
                _id: f._id,
                name: f.foodName,
                mealType: f.mealType,
                quantity: f.quantity,
                calories: f.calories,
                protein: f.protein,
                carbs: f.carbohydrates,
                fat: f.fat,
                isLegacy: true
            })),
            ...meals.map(m => ({
                _id: m._id,
                name: m.name,
                mealType: m.mealType,
                quantity: `${m.servings} serving(s)`,
                calories: m.calories,
                protein: m.protein,
                carbs: m.carbohydrates,
                fat: m.fats,
                isLegacy: false
            }))
        ];

        const remainingCalories = user.dailyCalorieGoal - totalCalories;
        const isOverTarget = remainingCalories < 0;

        // Sum water amount in ml
        const totalWater = waterEntries.reduce((sum, entry) => sum + (entry.amount || 0), 0);

        res.json({
            user: {
                name: user.name,
                fitnessGoal: user.fitnessGoal,
                weight: user.weight,
                height: user.height, // Added for BMI calculation
                calorieGoal: user.dailyCalorieGoal
            },
            goals: goal ? {
                protein: goal.protein,
                carbs: goal.carbohydrates,
                fat: goal.fats,
                water: goal.water
            } : null,
            consumed: {
                calories: totalCalories,
                protein: totalProtein,
                carbs: totalCarbs,
                fat: totalFat,
                fiber: totalFiber
            },
            remainingCalories: isOverTarget ? 0 : remainingCalories,
            isOverTarget: isOverTarget,
            water: totalWater,
            meals: combinedList
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { getDashboardSummary };
