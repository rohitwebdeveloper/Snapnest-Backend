const express = require('express')
const router = express.Router()
const asyncHandler = require('../utils/asyncHandler')
const isLoggedIn = require('../middlewares/isLoggedIn')
const { createNewAlbum,
    getAllAlbums,
    addPhotoToAlbum,
    removePhotoFromAlbum,
    getPhotosByAlbum,
    deleteAlbum,
    renameAlbum, } = require('../controllers/albumController')


router.post('/create', isLoggedIn, asyncHandler(createNewAlbum))
router.get('/all', isLoggedIn, asyncHandler(getAllAlbums))
router.put('/add-photo', isLoggedIn, asyncHandler(addPhotoToAlbum))
router.get('/:id/photos', isLoggedIn, asyncHandler(getPhotosByAlbum))
router.put('/remove-photo', isLoggedIn, asyncHandler(removePhotoFromAlbum))
router.delete('/delete', isLoggedIn, asyncHandler(deleteAlbum))
router.put('/rename', isLoggedIn, asyncHandler(renameAlbum))
// router.post('/delete-album', isLoggedIn, asyncHandler())



module.exports = router