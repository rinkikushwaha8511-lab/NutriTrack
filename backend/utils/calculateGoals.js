// Calculate daily nutrition goals based on BMR and TDEE

const calculateGoals = (user) => {
    const { age, gender, height, weight, activityLevel, fitnessGoal } = user;

    // 1. Calculate BMR (Mifflin-St Jeor)
    let bmr;
    if (gender === 'Male') {
        bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
    } else {
        bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
    }

    // 2. Calculate TDEE (Total Daily Energy Expenditure)
    let activityMultiplier = 1.2; // Sedentary
    switch (activityLevel) {
        case 'Lightly Active': activityMultiplier = 1.375; break;
        case 'Moderately Active': activityMultiplier = 1.55; break;
        case 'Very Active': activityMultiplier = 1.725; break;
    }
    const tdee = bmr * activityMultiplier;

    // 3. Adjust calories based on fitness goal
    let targetCalories = tdee;
    switch (fitnessGoal) {
        case 'Weight Loss': targetCalories -= 500; break;
        case 'Weight Gain': targetCalories += 500; break;
        case 'Muscle Gain': targetCalories += 250; break;
        // Maintain Weight stays the same
    }

    // Ensure we don't go below a safe minimum
    if (gender === 'Male' && targetCalories < 1500) targetCalories = 1500;
    if ((gender === 'Female' || gender === 'Other') && targetCalories < 1200) targetCalories = 1200;

    targetCalories = Math.round(targetCalories);

    // 4. Calculate Macros
    // Protein: approx 2g per kg of body weight (or scaled by goal)
    let proteinTarget = Math.round(weight * 2); 
    
    // Fat: 25% of total calories (1g fat = 9 calories)
    let fatTarget = Math.round((targetCalories * 0.25) / 9);
    
    // Carbs: Remaining calories (1g protein = 4 cals, 1g carb = 4 cals)
    const remainingCalories = targetCalories - (proteinTarget * 4) - (fatTarget * 9);
    let carbTarget = Math.round(remainingCalories / 4);

    return {
        calories: targetCalories,
        protein: proteinTarget,
        fats: fatTarget,
        carbohydrates: carbTarget,
        water: 8 // default
    };
};

module.exports = { calculateGoals };
