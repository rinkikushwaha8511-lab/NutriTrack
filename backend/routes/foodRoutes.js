const express = require('express');
const router = express.Router();
const { addFood, getTodayFoods, getFoodsByDate, updateFood, deleteFood } = require('../controllers/foodController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, addFood);

router.get('/today', protect, getTodayFoods);
router.get('/date/:date', protect, getFoodsByDate);

router.route('/:id')
    .put(protect, updateFood)
    .delete(protect, deleteFood);

module.exports = router;
