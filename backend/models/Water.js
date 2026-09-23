const mongoose = require('mongoose');

const waterSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' // Links to User model
    },
    amount: { type: Number, required: true }, // Amount in ml
    date: { type: String, required: true } // Format: YYYY-MM-DD
}, {
    timestamps: true
});

module.exports = mongoose.model('Water', waterSchema);
