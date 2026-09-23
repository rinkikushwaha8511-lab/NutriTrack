const express = require('express');
const router = express.Router();
const { getTodayWater, getWaterHistory, addWater, deleteWater } = require('../controllers/waterController');
const { protect } = require('../middleware/authMiddleware');

router.route('/today')
    .get(protect, getTodayWater);

router.route('/history')
    .get(protect, getWaterHistory);

router.route('/')
    .post(protect, addWater);

router.route('/:id')
    .delete(protect, deleteWater);

module.exports = router;
