const express = require('express');
const router = express.Router();
const { addMeal, getTodayMeals, getMealHistory, updateMeal, deleteMeal } = require('../controllers/mealController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, addMeal);
router.route('/today').get(protect, getTodayMeals);
router.route('/history').get(protect, getMealHistory);
router.route('/:id').put(protect, updateMeal).delete(protect, deleteMeal);

module.exports = router;
