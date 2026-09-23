const express = require('express');
const router = express.Router();
const { getWeightHistory, addWeight, deleteWeight } = require('../controllers/weightController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getWeightHistory)
    .post(protect, addWeight);

router.route('/:id')
    .delete(protect, deleteWeight);

module.exports = router;
