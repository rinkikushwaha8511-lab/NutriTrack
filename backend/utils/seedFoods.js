const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('../config/db');
const FoodItem = require('../models/FoodItem');

// Load env variables
dotenv.config();

const sampleFoods = [
    { name: "Roti", category: "Indian Food", calories: 120, protein: 3, carbohydrates: 18, fats: 3, fiber: 2, servingSize: 1, servingUnit: "piece" },
    { name: "Rice", category: "Grains", calories: 130, protein: 2, carbohydrates: 28, fats: 0, fiber: 0, servingSize: 100, servingUnit: "g" },
    { name: "Dal", category: "Indian Food", calories: 150, protein: 9, carbohydrates: 20, fats: 4, fiber: 6, servingSize: 1, servingUnit: "bowl" },
    { name: "Paneer", category: "Dairy", calories: 265, protein: 18, carbohydrates: 1, fats: 20, fiber: 0, servingSize: 100, servingUnit: "g" },
    { name: "Poha", category: "Indian Food", calories: 250, protein: 5, carbohydrates: 45, fats: 6, fiber: 2, servingSize: 1, servingUnit: "bowl" },
    { name: "Upma", category: "Indian Food", calories: 200, protein: 6, carbohydrates: 30, fats: 5, fiber: 3, servingSize: 1, servingUnit: "bowl" },
    { name: "Idli", category: "Indian Food", calories: 40, protein: 1, carbohydrates: 8, fats: 0, fiber: 0, servingSize: 1, servingUnit: "piece" },
    { name: "Dosa", category: "Indian Food", calories: 130, protein: 3, carbohydrates: 22, fats: 3, fiber: 1, servingSize: 1, servingUnit: "piece" },
    { name: "Paratha", category: "Indian Food", calories: 260, protein: 5, carbohydrates: 30, fats: 12, fiber: 2, servingSize: 1, servingUnit: "piece" },
    { name: "Khichdi", category: "Indian Food", calories: 180, protein: 6, carbohydrates: 32, fats: 2, fiber: 4, servingSize: 1, servingUnit: "bowl" },
    { name: "Curd", category: "Dairy", calories: 98, protein: 11, carbohydrates: 3, fats: 4, fiber: 0, servingSize: 100, servingUnit: "g" },
    { name: "Chole", category: "Indian Food", calories: 220, protein: 10, carbohydrates: 30, fats: 6, fiber: 8, servingSize: 1, servingUnit: "bowl" },
    { name: "Rajma", category: "Indian Food", calories: 240, protein: 12, carbohydrates: 35, fats: 5, fiber: 10, servingSize: 1, servingUnit: "bowl" },
    { name: "Banana", category: "Fruits", calories: 105, protein: 1, carbohydrates: 27, fats: 0, fiber: 3, servingSize: 1, servingUnit: "medium" },
    { name: "Apple", category: "Fruits", calories: 95, protein: 0, carbohydrates: 25, fats: 0, fiber: 4, servingSize: 1, servingUnit: "medium" },
    { name: "Milk", category: "Dairy", calories: 149, protein: 8, carbohydrates: 12, fats: 8, fiber: 0, servingSize: 240, servingUnit: "ml" },
    { name: "Egg", category: "Protein", calories: 70, protein: 6, carbohydrates: 0, fats: 5, fiber: 0, servingSize: 1, servingUnit: "large" },
    { name: "Chicken Breast", category: "Protein", calories: 165, protein: 31, carbohydrates: 0, fats: 3, fiber: 0, servingSize: 100, servingUnit: "g" }
];

const seedFoods = async () => {
    try {
        await connectDB();

        console.log("Checking for existing foods...");
        for (const food of sampleFoods) {
            const exists = await FoodItem.findOne({ name: food.name });
            if (!exists) {
                await FoodItem.create(food);
                console.log(`Added: ${food.name}`);
            } else {
                console.log(`Skipped: ${food.name} (Already exists)`);
            }
        }

        console.log("Seeding process completed!");
        process.exit();
    } catch (error) {
        console.error(`Error with seeding: ${error.message}`);
        process.exit(1);
    }
};

seedFoods();
