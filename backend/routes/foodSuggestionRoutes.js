const express = require('express');
const router = express.Router();
const { getFoodSuggestions } = require('../controllers/foodSuggestionController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getFoodSuggestions);

module.exports = router;
