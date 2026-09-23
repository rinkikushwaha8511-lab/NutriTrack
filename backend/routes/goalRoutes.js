const express = require('express');
const router = express.Router();
const { getGoals, updateGoals, autoCalculateGoals } = require('../controllers/goalController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getGoals).put(protect, updateGoals).post(protect, updateGoals); // allow POST on / to create goals as well
router.post('/calculate', protect, autoCalculateGoals);

module.exports = router;
