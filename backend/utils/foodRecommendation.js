/**
 * Calculates BMR (Mifflin-St Jeor Equation)
 */
const calculateBMR = (weight, height, age, gender) => {
    if (!weight || !height || !age) return 1800;
    const g = (gender || '').toLowerCase();
    if (g === 'female' || g === 'f') {
        return Math.round(10 * weight + 6.25 * height - 5 * age - 161);
    }
    return Math.round(10 * weight + 6.25 * height - 5 * age + 5);
};

/**
 * Calculates TDEE based on activity level
 */
const calculateTDEE = (bmr, activityLevel) => {
    const multipliers = {
        'Sedentary': 1.2,
        'Lightly Active': 1.375,
        'Moderately Active': 1.55,
        'Very Active': 1.725,
        'Super Active': 1.9
    };
    const mult = multipliers[activityLevel] || 1.375;
    return Math.round(bmr * mult);
};

/**
 * Calculates BMI and category
 */
const calculateBMI = (weight, height) => {
    if (!weight || !height) return { bmi: 22, category: 'Normal weight' };
    const heightInMeters = height / 100;
    const bmi = parseFloat((weight / (heightInMeters * heightInMeters)).toFixed(1));
    let category = 'Normal weight';
    if (bmi < 18.5) category = 'Underweight';
    else if (bmi >= 25 && bmi < 29.9) category = 'Overweight';
    else if (bmi >= 30) category = 'Obese';
    return { bmi, category };
};

/**
 * Determines if a food is restricted based on dietary preference
 */
const isRestricted = (food, preference) => {
    const nameLower = food.name.toLowerCase();
    const catLower = (food.category || '').toLowerCase();

    const meatKeywords = ['chicken', 'beef', 'pork', 'fish', 'meat', 'egg', 'mutton', 'prawn', 'salmon', 'turkey'];
    const dairyKeywords = ['milk', 'cheese', 'paneer', 'curd', 'yogurt', 'ghee', 'butter', 'dairy', 'whey'];

    const hasMeat = meatKeywords.some(kw => nameLower.includes(kw));
    const hasDairy = dairyKeywords.some(kw => nameLower.includes(kw)) || catLower === 'dairy';

    if (preference === 'Vegetarian' && hasMeat) return true;
    if (preference === 'Vegan' && (hasMeat || hasDairy)) return true;
    
    return false;
};

/**
 * Assigns food items to appropriate meal slots
 */
const fitsMealSlot = (food, mealSlot) => {
    const nameLower = food.name.toLowerCase();
    const catLower = (food.category || '').toLowerCase();

    const breakfastItems = ['poha', 'upma', 'idli', 'dosa', 'paratha', 'oats', 'egg', 'omelette', 'toast', 'bread', 'pancake', 'banana', 'apple', 'milk', 'muesli', 'dhokla', 'sprouts', 'cheela', 'sandwich'];
    const lunchItems = ['roti', 'rice', 'dal', 'paneer', 'chicken', 'curry', 'sabzi', 'khichdi', 'chapati', 'biryani', 'rajma', 'chole', 'fish', 'salad', 'thali'];
    const dinnerItems = ['roti', 'dal', 'paneer', 'soup', 'khichdi', 'curry', 'sabzi', 'salad', 'tofu', 'chicken', 'fish', 'chapati', 'dalia'];
    const snackItems = ['fruit', 'apple', 'banana', 'nuts', 'almond', 'walnut', 'chana', 'makhana', 'biscuit', 'tea', 'coffee', 'smoothie', 'juice', 'yogurt', 'curd', 'sprouts', 'peanut', 'snack', 'bhel'];

    if (mealSlot === 'Breakfast') {
        return breakfastItems.some(k => nameLower.includes(k)) || catLower.includes('breakfast') || (food.calories >= 100 && food.calories <= 450);
    }
    if (mealSlot === 'Lunch') {
        return lunchItems.some(k => nameLower.includes(k)) || catLower.includes('main') || catLower.includes('grain') || food.calories >= 150;
    }
    if (mealSlot === 'Dinner') {
        return dinnerItems.some(k => nameLower.includes(k)) || catLower.includes('main') || food.calories >= 120;
    }
    if (mealSlot === 'Snacks') {
        return snackItems.some(k => nameLower.includes(k)) || catLower.includes('snack') || catLower.includes('fruit') || food.calories <= 300;
    }

    return true;
};

/**
 * Calculates a recommendation score for a food item.
 */
const calculateScore = (food, user, goal, intake, targetMealCalories = 500) => {
    let score = 50;
    let reasons = [];

    const calorieDensity = food.calories / (food.servingSize || 100);

    // Goal-based scoring
    switch (user.fitnessGoal) {
        case 'Weight Loss':
            if (calorieDensity < 1.5) { score += 15; reasons.push('Low calorie density for fat loss.'); }
            if (food.fiber >= 3) { score += 10; reasons.push('High fiber keeps you full longer.'); }
            if (food.protein >= 10) { score += 15; reasons.push('High protein boosts metabolism.'); }
            if (food.calories > 450) { score -= 15; }
            break;
        case 'Weight Gain':
            if (calorieDensity > 1.8) { score += 15; reasons.push('Calorie-dense to help weight gain.'); }
            if (food.calories >= 250) { score += 10; reasons.push('Good calorie boost.'); }
            if (food.protein >= 8) { score += 10; reasons.push('Supports healthy muscle mass.'); }
            break;
        case 'Muscle Gain':
            if (food.protein >= 15) { score += 25; reasons.push('High protein content ideal for muscle synthesis.'); }
            else if (food.protein >= 8) { score += 12; reasons.push('Good protein source for muscle growth.'); }
            if (food.carbohydrates >= 20) { score += 8; reasons.push('Provides glycogen energy for workouts.'); }
            break;
        case 'Maintain Weight':
        default:
            if (food.fiber >= 3) score += 8;
            if (food.protein >= 6) score += 8;
            reasons.push('Nutritiously balanced choice for weight maintenance.');
            break;
    }

    // Match with targeted meal calories
    const calDiff = Math.abs(food.calories - targetMealCalories);
    if (calDiff <= 100) {
        score += 15;
        reasons.push('Fits your target meal portion size perfectly.');
    }

    // Default fallback reason
    if (reasons.length === 0) {
        reasons.push(`Complements your ${user.dietaryPreference || 'daily'} diet plan.`);
    }

    const finalReason = [...new Set(reasons)].slice(0, 2).join(' ');

    return { score, reason: finalReason };
};

/**
 * Gets personalized recommendations categorized by meal and body metrics
 */
const getRecommendations = (foods, user, goal, intake, limit = 5) => {
    // 1. Calculate Body Metrics
    const bmr = calculateBMR(user.weight, user.height, user.age, user.gender);
    const tdee = calculateTDEE(bmr, user.activityLevel);
    const { bmi, category: bmiCategory } = calculateBMI(user.weight, user.height);

    // Target calories
    const targetCalories = user.dailyCalorieGoal || goal?.calories || tdee;
    const targetProtein = goal?.protein || Math.round(user.weight ? user.weight * 1.8 : 60);
    const targetCarbs = goal?.carbohydrates || Math.round((targetCalories * 0.5) / 4);
    const targetFats = goal?.fats || Math.round((targetCalories * 0.25) / 9);

    // Meal target calories breakdown
    const mealTargets = {
        Breakfast: { calories: Math.round(targetCalories * 0.25), protein: Math.round(targetProtein * 0.25) },
        Lunch: { calories: Math.round(targetCalories * 0.35), protein: Math.round(targetProtein * 0.35) },
        Dinner: { calories: Math.round(targetCalories * 0.25), protein: Math.round(targetProtein * 0.25) },
        Snacks: { calories: Math.round(targetCalories * 0.15), protein: Math.round(targetProtein * 0.15) }
    };

    // Filter restricted foods by dietary preference
    const eligibleFoods = foods.filter(food => !isRestricted(food, user.dietaryPreference));

    // Calculate suggestions per meal type
    const mealSlots = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];
    const mealPlan = {};

    mealSlots.forEach(slot => {
        const slotTargetCal = mealTargets[slot].calories;

        const scoredForSlot = eligibleFoods
            .filter(food => fitsMealSlot(food, slot))
            .map(food => {
                const { score, reason } = calculateScore(food, user, goal, intake, slotTargetCal);
                return {
                    ...food.toObject(),
                    score,
                    reason,
                    suggestedMealType: slot,
                    recommendedServings: Math.max(1, Math.round((slotTargetCal / (food.calories || 100)) * 10) / 10)
                };
            })
            .sort((a, b) => b.score - a.score);

        mealPlan[slot.toLowerCase()] = {
            targetCalories: mealTargets[slot].calories,
            targetProtein: mealTargets[slot].protein,
            suggestions: scoredForSlot.slice(0, 3)
        };
    });

    // Top overall recommendations (for backward compatibility)
    const overallScored = eligibleFoods
        .map(food => {
            const { score, reason } = calculateScore(food, user, goal, intake, 350);
            return {
                ...food.toObject(),
                score,
                reason
            };
        })
        .sort((a, b) => b.score - a.score);

    return {
        userProfile: {
            age: user.age,
            gender: user.gender,
            height: user.height,
            weight: user.weight,
            bmi,
            bmiCategory,
            bmr,
            tdee,
            fitnessGoal: user.fitnessGoal,
            activityLevel: user.activityLevel,
            dietaryPreference: user.dietaryPreference,
            dailyCalorieGoal: targetCalories,
            targetProtein,
            targetCarbs,
            targetFats
        },
        mealPlan,
        recommendations: overallScored.slice(0, limit)
    };
};

module.exports = {
    calculateBMR,
    calculateTDEE,
    calculateBMI,
    getRecommendations
};
