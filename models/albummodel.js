const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema({
    albumname: {
        type: String,
        required: true,
        default: 'album',
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
