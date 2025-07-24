const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    joinedAt: {
        type: Date,
        default: Date.now
    },
    avatar: {
        type: String,
        default: ''
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    theme: {
        type: String,
        enum: ['light', 'dark'],
        default: 'light'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);
