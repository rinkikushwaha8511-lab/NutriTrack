const Water = require('../models/Water');
const { getLocalDateString } = require('../utils/dateUtils');

// @desc    Get water intake entries for today
// @route   GET /api/water/today
// @access  Private
const getTodayWater = async (req, res, next) => {
    try {
        const todayStr = getLocalDateString();
        const waterEntries = await Water.find({ user: req.user._id, date: todayStr });
        
        const totalAmount = waterEntries.reduce((sum, entry) => sum + entry.amount, 0);

        res.json({
            entries: waterEntries,
            total: totalAmount
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get water intake history grouped by date
// @route   GET /api/water/history
// @access  Private
const getWaterHistory = async (req, res, next) => {
    try {
        const history = await Water.aggregate([
            { $match: { user: req.user._id } },
            { $group: { _id: "$date", total: { $sum: "$amount" } } },
            { $sort: { _id: -1 } }
        ]);
        
        res.json(history.map(h => ({ date: h._id, total: h.total })));
    } catch (error) {
        next(error);
    }
};

// @desc    Add a water entry
// @route   POST /api/water
// @access  Private
const addWater = async (req, res, next) => {
    try {
        const { amount } = req.body;
        if (!amount || amount <= 0) {
            res.status(400);
            throw new Error('Amount must be greater than 0');
        }

        const todayStr = getLocalDateString();
        const water = await Water.create({
            user: req.user._id,
            date: todayStr,
            amount
        });

        res.status(201).json(water);
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a water entry
// @route   DELETE /api/water/:id
// @access  Private
const deleteWater = async (req, res, next) => {
    try {
        const water = await Water.findById(req.params.id);

        if (!water) {
            res.status(404);
            throw new Error('Water entry not found');
        }

        // Check if it belongs to user
        if (water.user.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('Not authorized to delete this record');
        }

        await water.deleteOne();
        res.json({ message: 'Water entry removed' });
    } catch (error) {
        next(error);
    }
};

module.exports = { getTodayWater, getWaterHistory, addWater, deleteWater };
