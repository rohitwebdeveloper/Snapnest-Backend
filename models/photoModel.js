const mongoose = require('mongoose');
const Album = require('./albumModel')


const photoSchema = new mongoose.Schema({
    name: {
        type: String,
        default: 'Img'
    },
    category: {
        type: String,
        enum: ['photos', 'documents', 'screenshots'],
        default: 'photos'
    },
    url: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    location: {
        type: String,
        default: ''
    },
    size: {
        type: Number,
        required: true
    },
    format: {
        type: String,
        required: true
    },
    width: {
        type: Number
    },
    height: {
        type: Number
    },
    isFavourite: {
        type: Boolean,
        default: false
    },
    album: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Album',
        default: null
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Photo', photoSchema);
