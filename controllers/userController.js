const userModel = require('../models/userModel')
const { uploadImgCloudinary, deleteImageFromCloudinary } = require('../services/cloudinary')
const getPublicIdFromUrl = require('../utils/getPublicId')


const uploadProfileImage = async (req, res) => {

    const userId = req.user._id

    const user = await userModel.findOne({ _id: userId })
    if (user.avatar) {
        const publicId = getPublicIdFromUrl(user.avatar)
        if (publicId) {
            await deleteImageFromCloudinary(publicId)
        }
    }

    const result = await uploadImgCloudinary(req.file.buffer)
    if (!result || !result.secure_url || !result.public_id) {
        return res.status(500).json({ message: 'Image upload failed' });
    }

    user.avatar = result.secure_url
    await user.save()

    return res.status(200).json({
        success: true,
        message: 'Profile image updated',
        user
    })

}


module.exports = {
    uploadProfileImage,
}