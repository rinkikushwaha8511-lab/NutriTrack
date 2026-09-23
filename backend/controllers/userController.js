const User = require('../models/User');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                age: user.age,
                gender: user.gender,
                height: user.height,
                weight: user.weight,
                dailyCalorieGoal: user.dailyCalorieGoal,
                activityLevel: user.activityLevel,
                fitnessGoal: user.fitnessGoal,
                dietaryPreference: user.dietaryPreference
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            // Update fields if provided, otherwise keep existing
            user.name = req.body.name || user.name;
            user.age = req.body.age || user.age;
            user.gender = req.body.gender || user.gender;
            user.height = req.body.height || user.height;
            user.weight = req.body.weight || user.weight;
            user.dailyCalorieGoal = req.body.dailyCalorieGoal || user.dailyCalorieGoal;
            user.activityLevel = req.body.activityLevel || user.activityLevel;
            user.fitnessGoal = req.body.fitnessGoal || user.fitnessGoal;
            user.dietaryPreference = req.body.dietaryPreference || user.dietaryPreference;

            // Save updated user to database
            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                age: updatedUser.age,
                gender: updatedUser.gender,
                height: updatedUser.height,
                weight: updatedUser.weight,
                dailyCalorieGoal: updatedUser.dailyCalorieGoal,
                activityLevel: updatedUser.activityLevel,
                fitnessGoal: updatedUser.fitnessGoal,
                dietaryPreference: updatedUser.dietaryPreference
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error("Profile Update Error:", error);
        next(error);
    }
};

module.exports = { getUserProfile, updateUserProfile };
