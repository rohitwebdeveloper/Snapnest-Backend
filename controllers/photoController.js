
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



const getSinglePhotoDetails = async (req, res) => {
  const { photoid } = req.params
  const { _id } = req.user

  if (!photoid) return res.status(404).json({ message: "No image found" })

  const photo = await photoModel.findOne({ _id: photoid, uploadedBy: _id })
  if (!photo) return res.status(404).json({ message: "No image found" })

  return res.status(200).json({ success: true, message: 'Image fetched successfully', photo })
}



const updatephotodetails = async (req, res) => {
  const { description, location, photoId } = req.body
  const { _id } = req.user

  const photo = await photoModel.findOneAndUpdate(
    { _id: photoId, uploadedBy: _id },
    { description: description, location: location },
    { new: true },
  )
  if (!photo) {
    return res.status(404).json({ message: 'Image not found or not authorized' });
  }

  return res.status(200).json({
    success: true,
    message: 'Details updated successfully',
    photo
  });
}




const addScreenshot = async (req, res) => {
  const { photoId } = req.body;
  const userId = req.user._id;

  if (!photoId) {
    return res.status(400).json({ success: false, message: 'Photo ID is required' });
  }

  const updated = await photoModel.findOneAndUpdate(
    { _id: photoId, uploadedBy: userId },
    { category: 'screenshots' },
    { new: true }
  );

  if (!updated) {
    return res.status(404).json({ success: false, message: 'Photo not found or unauthorized' });
  }

  return res.status(200).json({ success: true, message: 'Added to screenshots' });
};



const deletePhoto = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: 'Photo id is required' })
  }

  const deleted = await photoModel.findByIdAndDelete(id);
  if (!deleted) return res.status(404).json({ success: false, message: 'Photo not found' });

  return res.status(200).json({ success: true, message: 'Photo deleted' });
};




const addToFavourite = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: 'Photo id is required' })
  }
  const updated = await photoModel.findByIdAndUpdate(id, { isFavourite: true }, { new: true });
  if (!updated) return res.status(404).json({ success: false, message: 'Photo not found' });

  return res.status(200).json({ success: true, message: 'Added to favourites', photo: updated });
};




const removeFromFavourite = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: 'Photo id is required' })
  }
  const updated = await photoModel.findByIdAndUpdate(id, { isFavourite: false }, { new: true });
  if (!updated) return res.status(404).json({ success: false, message: 'Photo not found' });

  return res.status(200).json({ success: true, message: 'Removed from favourites', photo: updated });

};



const getAllFavourites = async (req, res) => {
  const userId = req.user._id; 

  const favourites = await photoModel.find({ uploadedBy: userId, isFavourite: true });

  return res.status(200).json({
    success: true,
    message:
      favourites.length === 0 ? 'No favourites found' : 'Favourites fetched successfully',
    favourites,
  });
};



const getAllScreenshot = async (req, res) => {
  const userId = req.user._id;

  const screenshots = await photoModel.find({
    uploadedBy: userId,
    category: 'screenshots'
  });

  return res.status(200).json({
    success: true,
    message: 'Screenshots fetched successfully',
    screenshots, // changed variable name for clarity
  });
};




module.exports = {
  getPhotos,
  addPhotos,
  getSinglePhotoDetails,
  updatephotodetails,
  addScreenshot,
  deletePhoto,
  addToFavourite,
  removeFromFavourite,
  getAllFavourites,
  getAllScreenshot
}