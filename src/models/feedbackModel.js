const mongoose = require('mongoose')

const feedbackSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
    },
    query: {
        type: String,
        required: true,
        trim: true,
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Feedback', feedbackSchema);

