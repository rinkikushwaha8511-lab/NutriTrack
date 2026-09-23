const express = require('express');
const router = express.Router();
const { getFoodItems, getFoodItemById } = require('../controllers/foodItemController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getFoodItems);
router.route('/:id').get(protect, getFoodItemById);

module.exports = router;
