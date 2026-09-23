const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    height: { type: Number, required: true }, // in cm
    weight: { type: Number, required: true }, // in kg
    dailyCalorieGoal: { type: Number, required: true },
    activityLevel: { type: String, default: 'Sedentary' },
    fitnessGoal: { type: String, default: 'Maintain Weight' },
    dietaryPreference: { type: String, default: 'Other' },
    role: { type: String, enum: ['user', 'admin'], default: 'user' }
}, {
    timestamps: true // Automatically creates createdAt and updatedAt fields
});

// Hash password before saving to database
userSchema.pre('save', async function () {
    // Only hash the password if it has been modified
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Method to check password on login
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
