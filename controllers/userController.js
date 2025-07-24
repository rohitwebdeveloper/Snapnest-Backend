const userModel = require('../models/userModel')
const { uploadImgCloudinary, deleteImageFromCloudinary } = require('../services/cloudinary')
const getPublicIdFromUrl = require('../utils/getPublicId')
const feedbackModel = require('../models/feedbackModel')


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


const saveFeedbackAndQuery = async (req, res) => {
    const { name, email, query } = req.body;

    if (!name?.trim() || !email?.trim() || !query?.trim()) {
        return res.status(400).json({ message: 'Please fill all the details' });
    }

    const feed = new feedbackModel({
        name: name.trim(),
        email: email.trim(),
        query: query.trim()
    });

    await feed.save();
    return res.status(201).json({ success: true, message: 'Feedback submitted!' });
};



module.exports = {
    uploadProfileImage,
    saveFeedbackAndQuery,
}