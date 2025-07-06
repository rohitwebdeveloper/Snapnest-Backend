const cloudinary = require('../config/cloudnaryConfig');
const streamifier = require('streamifier')

const options = {
    resource_type: 'image',
    folder: 'snapnest',
    use_filename: false,
    unique_filename: true,
    overwrite: false
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




const deleteImageFromCloudinary = async (publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId)
        // console.log('Cloudinary delete result:', result);
        return result
    } catch (error) {
        console.error(error)
        throw new Error('Failed to delete photo')
    }
}




module.exports = {
    uploadImgCloudinary,
    deleteImageFromCloudinary,
}
