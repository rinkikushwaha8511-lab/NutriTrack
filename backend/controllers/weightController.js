const WeightLog = require('../models/WeightLog');
const User = require('../models/User');
const { getLocalDateString } = require('../utils/dateUtils');

// @desc    Get weight history
// @route   GET /api/weight
// @access  Private
const getWeightHistory = async (req, res, next) => {
    try {
        const history = await WeightLog.find({ user: req.user._id }).sort({ date: -1 });
        res.json(history);
    } catch (error) {
        next(error);
    }
};

// @desc    Add a weight entry
// @route   POST /api/weight
// @access  Private
const addWeight = async (req, res, next) => {
    try {
        const { weight, date } = req.body;
        if (!weight || weight <= 0) {
            res.status(400);
            throw new Error('Weight must be greater than 0');
        }

        const logDate = date || getLocalDateString();

        const weightLog = await WeightLog.create({
            user: req.user._id,
            date: logDate,
            weight
        });

        // Update User profile so Dashboard instantly shows it
        const user = await User.findById(req.user._id);
        if (user) {
            user.weight = weight;
            await user.save();
        }

        res.status(201).json(weightLog);
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a weight entry
// @route   DELETE /api/weight/:id
// @access  Private
const deleteWeight = async (req, res, next) => {
    try {
        const weightLog = await WeightLog.findById(req.params.id);

        if (!weightLog) {
            res.status(404);
            throw new Error('Weight entry not found');
        }

        if (weightLog.user.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('Not authorized to delete this record');
        }

        await weightLog.deleteOne();

        // Optionally revert User.weight to the latest remaining log
        const latestLog = await WeightLog.findOne({ user: req.user._id }).sort({ date: -1 });
        const user = await User.findById(req.user._id);
        
        if (user) {
            if (latestLog) {
                user.weight = latestLog.weight;
            } else {
                // Keep the last known weight if no logs exist
            }
            await user.save();
        }

        res.json({ message: 'Weight entry removed' });
    } catch (error) {
        next(error);
    }
};

module.exports = { getWeightHistory, addWeight, deleteWeight };
