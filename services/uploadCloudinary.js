const cloudinary = require('../config/cloudnaryConfig');
const streamifier = require('streamifier');

const options = {
    resource_type: 'image',
    folder: 'snapnest',
    use_filename: true,
    unique_filename: false,
    overwrite: true
};

const uploadImgCloudinary = (bufferImg) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
            if (error) return reject(error);
            resolve(result);
        });
        streamifier.createReadStream(bufferImg).pipe(stream);
    });
};

module.exports = uploadImgCloudinary;
