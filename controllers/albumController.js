const albumModel = require('../models/albumModel')
const photoModel = require('../models/photoModel')


const createNewAlbum = async (req, res) => {
    const { _id } = req.user
    const { albumname } = req.body

    if (!albumname) {
        return res.status(400).json({ message: 'Please enter album title' })
    }

    const newAlbum = new albumModel({
        albumname: albumname,
        createdBy: _id
    })
    await newAlbum.save()

    return res.status(201).json({
        message: 'Album created successfully',
        album: newAlbum
    });
}



const getAllAlbums = async (req, res) => {
    const userId = req.user._id;

    const albums = await albumModel
        .find({ createdBy: userId })
        .select('-albumphotos');

    res.status(200).json({ success: true, albums });
};



const addPhotoToAlbum = async (req, res) => {
    const { albumId, photoId } = req.body;
    const userId = req.user._id;

    const album = await albumModel.findOne({ _id: albumId, createdBy: userId });
    if (!album) {
        return res.status(404).json({ message: 'Album not found or unauthorized' });
    }

    await photoModel.findByIdAndUpdate(photoId, { album: albumId })

    await albumModel.findByIdAndUpdate(albumId, {
        $addToSet: { albumphotos: photoId }
    });

    return res.status(200).json({ message: 'Photo added to album successfully' });
};



const getPhotosByAlbum = async (req, res) => {
    const { _id } = req.user
    const { albumId } = req.params

    const photos = await photoModel.find({ uploadedBy: _id, album: albumId })
    return res.status(200).json({ success: true, photos })
}



const removePhotoFromAlbum = async (req, res) => {
    const { albumId, photoId } = req.body;
    const userId = req.user._id;

    // 🔐 Ensure the album belongs to the logged-in user
    const album = await albumModel.findOne({ _id: albumId, createdBy: userId });
    if (!album) {
        return res.status(404).json({ message: 'Album not found or unauthorized' });
    }

    await albumModel.findByIdAndUpdate(albumId, {
        $pull: { albumphotos: photoId }
    });

    await photoModel.findByIdAndUpdate(photoId, {
        album: null
    });

    return res.status(200).json({ message: 'Photo removed from album successfully' });
};



const deleteAlbum = async (req, res) => {
    const { albumId } = req.body
    const { _id } = req.user
    if (!albumId) {
        return res.status(400).json({ message: 'Missing album ID' })
    }

    const deletedAlbum = await albumModel.deleteOne({
        _id: albumId,
        createdBy: _id
    });

    if (deletedAlbum.deletedCount === 0) {
        return res.status(404).json({ success: false, message: 'Failed to delete Album' })
    }
    return res.status(200).json({ success: true, message: 'Album deleted successfully' })
}




const renameAlbum = async (req, res) => {
    const { albumId, newname } = req.body;
    const userId = req.user._id;

    if (!newname?.trim()) {
        return res.status(400).json({ message: 'Enter new name' });
    }

    const updatedAlbum = await albumModel.findOneAndUpdate(
        { _id: albumId, createdBy: userId },
        { albumname: newname.trim() },
        { new: true }
    );

    if (!updatedAlbum) {
        return res.status(404).json({ message: 'Album not found or not authorized' });
    }

    return res.status(200).json({
        success: true,
        message: 'Album renamed successfully',
        album: updatedAlbum
    });
}




module.exports = {
    createNewAlbum,
    getAllAlbums,
    addPhotoToAlbum,
    removePhotoFromAlbum,
    getPhotosByAlbum,
    deleteAlbum,
    renameAlbum,
}