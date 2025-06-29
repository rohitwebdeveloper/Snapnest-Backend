const mongoose = require('mongoose');
const User = require('./userModel')

const albumSchema = new mongoose.Schema({
    albumname: {
        type: String,
        required: true,
        default: 'album',
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    albumphotos: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Photo',
        }
    ],
}, {
    timestamps: true,
});

module.exports = mongoose.model('Album', albumSchema);
