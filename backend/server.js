const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors()); // Allow cross-origin requests from frontend
app.use(express.json()); // Allow parsing JSON data in request body

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/foods', require('./routes/foodRoutes'));
app.use('/api/meals', require('./routes/mealRoutes'));
app.use('/api/food-items', require('./routes/foodItemRoutes'));
app.use('/api/water', require('./routes/waterRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/goals', require('./routes/goalRoutes'));
app.use('/api/weight', require('./routes/weightRoutes'));
app.use('/api/progress', require('./routes/progressRoutes'));
app.use('/api/food-suggestions', require('./routes/foodSuggestionRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Basic route for testing
app.get('/', (req, res) => {
    res.send('NutriTrack API is running...');
});

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Connect to database, THEN start server
connectDB().then(() => {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Server running on port ${PORT}`);
    });
});
