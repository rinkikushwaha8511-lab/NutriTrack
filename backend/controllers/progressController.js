const User = require('../models/User');
const Goal = require('../models/Goal');
const Food = require('../models/Food');
const Meal = require('../models/Meal');
const Water = require('../models/Water');
const WeightLog = require('../models/WeightLog');

// Helper to get local date strings for N days ago
const getDateNDaysAgo = (days) => {
    const d = new Date();
    d.setDate(d.getDate() - days);
    const offset = d.getTimezoneOffset();
    const localDate = new Date(d.getTime() - (offset * 60 * 1000));
    return localDate.toISOString().split('T')[0];
};

const getLocalDateString = () => {
    const today = new Date();
    const offset = today.getTimezoneOffset();
    const localDate = new Date(today.getTime() - (offset * 60 * 1000));
    return localDate.toISOString().split('T')[0];
};

// Generate an array of dates from start to end (inclusive)
const generateDateRangeArray = (startStr, endStr) => {
    const dates = [];
    let current = new Date(startStr);
    const end = new Date(endStr);
    
    while (current <= end) {
        dates.push(current.toISOString().split('T')[0]);
        current.setDate(current.getDate() + 1);
    }
    return dates;
};

// @desc    Get progress data
// @route   GET /api/progress?range=7d|30d|3m
// @access  Private
const getProgress = async (req, res, next) => {
    try {
        const { range } = req.query;
        let daysToFetch = 7;
        
        if (range === '30d') daysToFetch = 30;
        else if (range === '3m') daysToFetch = 90;
        else if (range !== '7d' && range !== undefined) {
            res.status(400);
            throw new Error('Invalid range parameter');
        }

        const todayStr = getLocalDateString();
        const startDateStr = getDateNDaysAgo(daysToFetch - 1); // e.g. today is 1st day, 6 days ago makes 7 days total

        const userId = req.user._id;

        // Fetch User and Goals
        const user = await User.findById(userId).select('-password');
        const goal = await Goal.findOne({ user: userId });

        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }

        // Fetch data strictly within date range
        const dateFilter = { user: userId, date: { $gte: startDateStr, $lte: todayStr } };

        const [foods, meals, waterEntries, weightLogs] = await Promise.all([
            Food.find(dateFilter),
            Meal.find(dateFilter),
            Water.find(dateFilter),
            WeightLog.find(dateFilter).sort({ date: 1 })
        ]);

        // Aggregate Data by Date
        const dailyData = {};
        const dateArray = generateDateRangeArray(startDateStr, todayStr);
        
        // Initialize all dates in range
        dateArray.forEach(d => {
            dailyData[d] = {
                date: d,
                calories: 0,
                protein: 0,
                carbs: 0,
                fat: 0,
                water: 0,
                weight: null
            };
        });

        // Add Foods
        foods.forEach(f => {
            if (dailyData[f.date]) {
                dailyData[f.date].calories += f.calories || 0;
                dailyData[f.date].protein += f.protein || 0;
                dailyData[f.date].carbs += f.carbohydrates || 0;
                dailyData[f.date].fat += f.fat || 0;
            }
        });

        // Add Meals
        meals.forEach(m => {
            if (dailyData[m.date]) {
                dailyData[m.date].calories += m.calories || 0;
                dailyData[m.date].protein += m.protein || 0;
                dailyData[m.date].carbs += m.carbohydrates || 0;
                dailyData[m.date].fat += m.fats || 0;
            }
        });

        // Add Water
        waterEntries.forEach(w => {
            if (dailyData[w.date]) {
                dailyData[w.date].water += w.amount || 0;
            }
        });

        // Map Weights
        const weightDataList = weightLogs.map(w => ({ date: w.date, weight: w.weight }));

        let weightChange = null;
        if (weightLogs.length >= 2) {
            const earliest = weightLogs[0].weight;
            const latest = weightLogs[weightLogs.length - 1].weight;
            weightChange = parseFloat((latest - earliest).toFixed(2));
        }

        // Calculate Averages
        let totalCals = 0;
        let daysWithFood = 0;
        let totalWater = 0;
        let daysWithWater = 0;

        const formattedCalories = [];
        const formattedMacros = [];
        const formattedWater = [];

        dateArray.forEach(d => {
            const data = dailyData[d];
            
            if (data.calories > 0) {
                totalCals += data.calories;
                daysWithFood++;
                
                formattedCalories.push({
                    date: d,
                    consumed: data.calories,
                    target: user.dailyCalorieGoal
                });

                formattedMacros.push({
                    date: d,
                    protein: data.protein,
                    carbs: data.carbs,
                    fat: data.fat
                });
            }

            if (data.water > 0) {
                totalWater += data.water;
                daysWithWater++;

                formattedWater.push({
                    date: d,
                    consumed: data.water,
                    target: goal && goal.water > 20 ? goal.water : 2000
                });
            }
        });

        const avgCalories = daysWithFood > 0 ? Math.round(totalCals / daysWithFood) : 0;
        const avgWater = daysWithWater > 0 ? Math.round(totalWater / daysWithWater) : 0;

        // BMI Calculation
        let bmiValue = null;
        let bmiCategory = 'Unknown';
        
        if (user.height && user.weight && user.height > 0 && user.weight > 0) {
            const heightInMeters = user.height / 100;
            const bmi = user.weight / (heightInMeters * heightInMeters);
            bmiValue = parseFloat(bmi.toFixed(2));
            
            if (bmi < 18.5) bmiCategory = 'Underweight';
            else if (bmi >= 18.5 && bmi <= 24.9) bmiCategory = 'Normal';
            else if (bmi >= 25 && bmi <= 29.9) bmiCategory = 'Overweight';
            else bmiCategory = 'Obesity';
        }

        res.json({
            range,
            summary: {
                currentWeight: user.weight,
                weightChange: weightChange,
                bmi: bmiValue,
                bmiCategory,
                averageCalories: avgCalories,
                averageWater: avgWater
            },
            weight: weightDataList,
            calories: formattedCalories,
            macros: formattedMacros,
            water: formattedWater
        });

    } catch (error) {
        next(error);
    }
};

module.exports = { getProgress };
