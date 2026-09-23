const express = require('express');
const router = express.Router();
const {
    getAdminDashboard,
    getAllUsers,
    createUser,
    updateUser,
    updateUserRole,
    deleteUser,
    getAdminFoodItems,
    createFoodItem,
    updateFoodItem,
    deleteFoodItem,
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

// All routes require authenticated user WITH role === 'admin'
router.use(protect, adminOnly);

// ── Overview / Dashboard Statistics ─────────────────────────
router.get('/dashboard', getAdminDashboard);

// ── User Management ─────────────────────────────────────────
router.get('/users', getAllUsers);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

// ── Food Items Catalog Management ────────────────────────────
router.get('/food-items', getAdminFoodItems);
router.post('/food-items', createFoodItem);
router.put('/food-items/:id', updateFoodItem);
router.delete('/food-items/:id', deleteFoodItem);

// ── Category Management ─────────────────────────────────────
router.get('/categories', getCategories);
router.post('/categories', createCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

module.exports = router;
