const mongoose = require('mongoose');

// Connect to MongoDB Database
const connectDB = async () => {
    try {
        const rawURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/NutriTrack';
        // Replace localhost with 127.0.0.1 to prevent Node 18+ IPv6 resolution issues on Windows
        const fixedURI = rawURI.replace('localhost', '127.0.0.1');
        
        const conn = await mongoose.connect(fixedURI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`MongoDB Connection Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;