
const photoModel = require('../models/photoModel')
const { uploadImgCloudinary, deleteImageFromCloudinary } = require('../services/cloudinary')
const sharp = require('sharp')
const getPublicIdFromUrl = require('../utils/getPublicId')
const albumModel = require('../models/albumModel')
const documentModel = require('../models/documentModel')



const getPhotos = async (req, res) => {
  const { _id } = req.user;
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 3

  const skip = (page - 1) * limit;

  const photos = await photoModel
    .find({ uploadedBy: _id })
    .populate('album')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalPhotos = await photoModel.countDocuments({ uploadedBy: _id });

  const hasMore = page * limit < totalPhotos;

  return res.status(200).json({
    photos,
    hasMore,
  });

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

  if (!id) return res.status(400).json({ message: 'Photo id is required' })

  const photo = await photoModel.findOne({ _id: id });
  if (!photo) return res.status(404).json({ message: 'Photo not found' });

  const publicId = await getPublicIdFromUrl(photo.url)

  if (publicId) {
    const cloudresult = await deleteImageFromCloudinary(publicId)

    if (cloudresult.result !== 'ok') {
      return res.status(500).json({ message: 'Failed to delete Photo' });
    }
  }

  // remove photo reference in albums
  await albumModel.updateMany(
    { albumphotos: id },
    { $pull: { albumphotos: id } }
  )

  // remove photo reference in documents
  await documentModel.deleteMany({ photo: id })

  await photoModel.findByIdAndDelete(id);

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



const getPhotosGroupedByLocation = async (req, res) => {

  const userId = req.user._id

  const groupedPhotos = await photoModel.aggregate([
    { $match: { uploadedBy: userId, location: { $ne: '' } } },
    {
      $group: {
        _id: '$location',
        photos: { $push: '$$ROOT' }
      }
    },
    { $sort: { _id: 1 } }
  ])

  return res.status(200).json({
    success: true,
    message: 'Photos grouped by location',
    groupedPhotos
  });
}



const getPhotoBySearch = async (req, res) => {
  const searchval = req.query.searchquery?.trim().toLowerCase().replace(/\s+/g, '');

  if (!searchval) return res.status(400).json({ success: false, message: "Search query required" });

  const regexPattern = new RegExp(searchval.split('').join('.*'), 'i');

  const query = {
    $or: [
      { name: { $regex: regexPattern } },
      { description: { $regex: regexPattern } },
      { category: { $regex: regexPattern } }
    ]
  };

  const searchresult = await photoModel.find(query);
  return res.status(200).json({ success: true, searchresult });
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
  getAllScreenshot,
  getPhotosGroupedByLocation,
  getPhotoBySearch
}