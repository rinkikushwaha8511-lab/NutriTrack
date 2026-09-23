const User = require('../models/User');
const bcrypt = require('bcryptjs');
const FoodItem = require('../models/FoodItem');
const Meal = require('../models/Meal');
const Water = require('../models/Water');
const WeightLog = require('../models/WeightLog');
const Category = require('../models/Category');

// Standard default categories to auto-seed if Category collection is empty
const DEFAULT_CATEGORIES = [
    { name: 'Fruits', description: 'Fresh fruits, berries, and dried fruit items' },
    { name: 'Vegetables', description: 'Fresh vegetables, greens, and legumes' },
    { name: 'Dairy', description: 'Milk, cheese, yogurt, and dairy products' },
    { name: 'Grains', description: 'Whole grains, rice, bread, oats, and cereals' },
    { name: 'Protein', description: 'Meat, poultry, fish, eggs, and plant protein' },
    { name: 'Beverages', description: 'Juices, teas, coffees, and healthy drinks' },
    { name: 'Snacks', description: 'Healthy snacks, nuts, seeds, and quick bites' },
    { name: 'Indian Food', description: 'Traditional Indian curries, dal, roti, and dishes' }
];

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private / Admin only
const getAdminDashboard = async (req, res, next) => {
    try {
        const [
            totalUsers,
            totalAdmins,
            totalFoodItems,
            totalMeals,
            totalWaterLogs,
            totalWeightLogs
        ] = await Promise.all([
            User.countDocuments({ role: 'user' }),
            User.countDocuments({ role: 'admin' }),
            FoodItem.countDocuments({}),
            Meal.countDocuments({}),
            Water.countDocuments({}),
            WeightLog.countDocuments({})
        ]);

        res.json({
            success: true,
            stats: {
                totalUsers,
                totalAdmins,
                totalFoodItems,
                totalMeals,
                totalWaterLogs,
                totalWeightLogs
            }
        });
    } catch (error) {
        next(error);
    }
};

// ==========================================
// USER MANAGEMENT CONTROLLERS
// ==========================================

// @desc    Get all users with search and role filter
// @route   GET /api/admin/users
// @access  Private / Admin only
const getAllUsers = async (req, res, next) => {
    try {
        const { search, role } = req.query;
        let query = {};

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        if (role && (role === 'user' || role === 'admin')) {
            query.role = role;
        }

        const users = await User.find(query)
            .select('-password')
            .sort({ createdAt: -1 });

        res.json({ success: true, count: users.length, users });
    } catch (error) {
        next(error);
    }
};

// @desc    Update user role — only demotion to 'user' is allowed (single-admin design)
// @route   PUT /api/admin/users/:id/role
// @access  Private / Admin only
const updateUserRole = async (req, res, next) => {
    try {
        const { role } = req.body;

        // Only 'user' is a valid target role — promotion to 'admin' is disabled
        if (role !== 'user') {
            res.status(403);
            throw new Error('Promotion to admin is disabled. NutriTrack operates with a single admin account.');
        }

        const user = await User.findById(req.params.id);
        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }

        // Prevent demoting the admin account itself
        if (user.role === 'admin') {
            res.status(400);
            throw new Error('Action prohibited: Cannot change the role of the admin account.');
        }

        user.role = 'user';
        await user.save();

        res.json({
            success: true,
            message: 'User role confirmed as user',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete user account
// @route   DELETE /api/admin/users/:id
// @access  Private / Admin only
const deleteUser = async (req, res, next) => {
    try {
        // Prevent self-deletion
        if (req.user._id.toString() === req.params.id) {
            res.status(400);
            throw new Error('Action prohibited: You cannot delete your own admin account');
        }

        const user = await User.findById(req.params.id);
        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }

        await user.deleteOne();

        res.json({
            success: true,
            message: 'User removed successfully'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create a new user (admin only)
// @route   POST /api/admin/users
// @access  Private / Admin only
const createUser = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            res.status(400);
            throw new Error('Name, email, and password are required');
        }

        const existing = await User.findOne({ email: email.toLowerCase().trim() });
        if (existing) {
            res.status(400);
            throw new Error('A user with this email already exists');
        }

        if (password.length < 6) {
            res.status(400);
            throw new Error('Password must be at least 6 characters');
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            role: 'user'
        });

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update user info (name, email) — admin only
// @route   PUT /api/admin/users/:id
// @access  Private / Admin only
const updateUser = async (req, res, next) => {
    try {
        const { name, email } = req.body;

        const user = await User.findById(req.params.id);
        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }

        if (user.role === 'admin') {
            res.status(400);
            throw new Error('Cannot edit the admin account from here');
        }

        if (name) user.name = name.trim();

        if (email && email.toLowerCase().trim() !== user.email) {
            const emailTaken = await User.findOne({ email: email.toLowerCase().trim(), _id: { $ne: user._id } });
            if (emailTaken) {
                res.status(400);
                throw new Error('This email is already used by another account');
            }
            user.email = email.toLowerCase().trim();
        }

        const updated = await user.save();

        res.json({
            success: true,
            message: 'User updated successfully',
            user: {
                _id: updated._id,
                name: updated.name,
                email: updated.email,
                role: updated.role
            }
        });
    } catch (error) {
        next(error);
    }
};

// ==========================================
// FOOD CATALOG MANAGEMENT CONTROLLERS
// ==========================================

// @desc    Get food items catalog for admin
// @route   GET /api/admin/food-items
// @access  Private / Admin only
const getAdminFoodItems = async (req, res, next) => {
    try {
        const { search, category } = req.query;
        let query = {};

        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        if (category && category !== 'All Categories') {
            query.category = category;
        }

        const foodItems = await FoodItem.find(query).sort({ name: 1 });
        res.json({ success: true, count: foodItems.length, foodItems });
    } catch (error) {
        next(error);
    }
};

// @desc    Create new food item catalog entry
// @route   POST /api/admin/food-items
// @access  Private / Admin only
const createFoodItem = async (req, res, next) => {
    try {
        const {
            name,
            category,
            calories,
            protein,
            carbohydrates,
            fats,
            fiber,
            servingSize,
            servingUnit
        } = req.body;

        if (!name || !category || calories === undefined || protein === undefined || carbohydrates === undefined || fats === undefined || fiber === undefined || servingSize === undefined || !servingUnit) {
            res.status(400);
            throw new Error('Please provide all required fields for the food item');
        }

        const existingItem = await FoodItem.findOne({ name: { $regex: `^${name.trim()}$`, $options: 'i' } });
        if (existingItem) {
            res.status(400);
            throw new Error(`Food item with name "${name}" already exists`);
        }

        const foodItem = await FoodItem.create({
            name: name.trim(),
            category: category.trim(),
            calories: Number(calories),
            protein: Number(protein),
            carbohydrates: Number(carbohydrates),
            fats: Number(fats),
            fiber: Number(fiber),
            servingSize: Number(servingSize),
            servingUnit: servingUnit.trim()
        });

        res.status(201).json({
            success: true,
            message: 'Food item created successfully',
            foodItem
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update food item catalog entry
// @route   PUT /api/admin/food-items/:id
// @access  Private / Admin only
const updateFoodItem = async (req, res, next) => {
    try {
        const foodItem = await FoodItem.findById(req.params.id);
        if (!foodItem) {
            res.status(404);
            throw new Error('Food item not found');
        }

        const {
            name,
            category,
            calories,
            protein,
            carbohydrates,
            fats,
            fiber,
            servingSize,
            servingUnit
        } = req.body;

        if (name && name.trim() !== foodItem.name) {
            const existingName = await FoodItem.findOne({ 
                name: { $regex: `^${name.trim()}$`, $options: 'i' },
                _id: { $ne: req.params.id }
            });
            if (existingName) {
                res.status(400);
                throw new Error(`Another food item with name "${name}" already exists`);
            }
            foodItem.name = name.trim();
        }

        if (category) foodItem.category = category.trim();
        if (calories !== undefined) foodItem.calories = Number(calories);
        if (protein !== undefined) foodItem.protein = Number(protein);
        if (carbohydrates !== undefined) foodItem.carbohydrates = Number(carbohydrates);
        if (fats !== undefined) foodItem.fats = Number(fats);
        if (fiber !== undefined) foodItem.fiber = Number(fiber);
        if (servingSize !== undefined) foodItem.servingSize = Number(servingSize);
        if (servingUnit) foodItem.servingUnit = servingUnit.trim();

        const updatedItem = await foodItem.save();

        res.json({
            success: true,
            message: 'Food item updated successfully',
            foodItem: updatedItem
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete food item catalog entry
// @route   DELETE /api/admin/food-items/:id
// @access  Private / Admin only
const deleteFoodItem = async (req, res, next) => {
    try {
        const foodItem = await FoodItem.findById(req.params.id);
        if (!foodItem) {
            res.status(404);
            throw new Error('Food item not found');
        }

        await foodItem.deleteOne();

        res.json({
            success: true,
            message: 'Food item deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

// ==========================================
// CATEGORY MANAGEMENT CONTROLLERS
// ==========================================

// @desc    Get all categories (auto-seeds defaults if empty)
// @route   GET /api/admin/categories
// @access  Private / Admin only
const getCategories = async (req, res, next) => {
    try {
        let categories = await Category.find({}).sort({ name: 1 });

        // Auto-seed standard default categories if collection is currently empty
        if (categories.length === 0) {
            await Category.insertMany(DEFAULT_CATEGORIES);
            categories = await Category.find({}).sort({ name: 1 });
        }

        // Aggregate food counts for each category
        const foodCounts = await FoodItem.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 } } }
        ]);

        const countMap = {};
        foodCounts.forEach(item => {
            if (item._id) countMap[item._id.toLowerCase()] = item.count;
        });

        const formattedCategories = categories.map(cat => ({
            _id: cat._id,
            name: cat.name,
            description: cat.description,
            foodCount: countMap[cat.name.toLowerCase()] || 0,
            createdAt: cat.createdAt
        }));

        res.json({
            success: true,
            count: formattedCategories.length,
            categories: formattedCategories
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create a new food category
// @route   POST /api/admin/categories
// @access  Private / Admin only
const createCategory = async (req, res, next) => {
    try {
        const { name, description } = req.body;

        if (!name || !name.trim()) {
            res.status(400);
            throw new Error('Category name is required');
        }

        const existingCategory = await Category.findOne({
            name: { $regex: `^${name.trim()}$`, $options: 'i' }
        });

        if (existingCategory) {
            res.status(400);
            throw new Error(`Category "${name.trim()}" already exists`);
        }

        const category = await Category.create({
            name: name.trim(),
            description: description ? description.trim() : ''
        });

        res.status(201).json({
            success: true,
            message: 'Category created successfully',
            category
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update an existing category
// @route   PUT /api/admin/categories/:id
// @access  Private / Admin only
const updateCategory = async (req, res, next) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            res.status(404);
            throw new Error('Category not found');
        }

        const { name, description } = req.body;
        const oldName = category.name;

        if (name && name.trim() !== category.name) {
            const existing = await Category.findOne({
                name: { $regex: `^${name.trim()}$`, $options: 'i' },
                _id: { $ne: req.params.id }
            });
            if (existing) {
                res.status(400);
                throw new Error(`Category "${name.trim()}" already exists`);
            }
            category.name = name.trim();

            // Optionally update existing FoodItems using the old category name
            await FoodItem.updateMany(
                { category: oldName },
                { category: name.trim() }
            );
        }

        if (description !== undefined) {
            category.description = description.trim();
        }

        const updatedCategory = await category.save();

        res.json({
            success: true,
            message: 'Category updated successfully',
            category: updatedCategory
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a category
// @route   DELETE /api/admin/categories/:id
// @access  Private / Admin only
const deleteCategory = async (req, res, next) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            res.status(404);
            throw new Error('Category not found');
        }

        await category.deleteOne();

        res.json({
            success: true,
            message: 'Category deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
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
};
