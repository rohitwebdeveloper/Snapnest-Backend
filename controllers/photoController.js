
const photoModel = require('../models/photoModel')
const uploadImgCloudinary = require('../services/uploadCloudinary')
const sharp = require('sharp')


const getPhotos = async (req, res) => {
  const { _id } = req.user;

  const allPhotos = await photoModel
    .find({ uploadedBy: _id })
    .populate('album')
    .sort({ createdAt: -1 });

  return res.status(200).json(allPhotos);

}



const addPhotos = async (req, res) => {
  const { _id } = req.user;
  const { originalname } = req.file;
  const { category } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: 'Please upload an image' });
  }

  const metaData = await sharp(req.file.buffer).metadata();

  const result = await uploadImgCloudinary(req.file.buffer);

  if (!result || !result.secure_url || !result.public_id) {
    return res.status(500).json({ message: 'Image upload failed' });
  }

  const newPhoto = new photoModel({
    name: originalname,
    category,
    url: result.secure_url,
    size: metaData.size,
    format: metaData.format,
    width: metaData.width,
    height: metaData.height,
    uploadedBy: _id,
  });

  await newPhoto.save();

  return res.status(201).json({ success: true, message: 'Uploaded successfully', newPhoto });
};





module.exports = {
  getPhotos,
  addPhotos,
}