const express = require('express')
const router = express.Router()
const upload = require('../config/multerConfig')
const asyncHandler = require('../utils/asyncHandler')
const isLoggedIn = require('../middlewares/isLoggedIn')
const { getPhotos,
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
    getPhotoBySearch, } = require('../controllers/photoController')


router.get('/places', isLoggedIn, asyncHandler(getPhotosGroupedByLocation));

router.post('/upload', isLoggedIn, upload.single('photo'), asyncHandler(addPhotos))

router.get('/all', isLoggedIn, asyncHandler(getPhotos))

router.get('/search', isLoggedIn, asyncHandler(getPhotoBySearch));

router.put('/update-detail', isLoggedIn, asyncHandler(updatephotodetails))

router.put('/add-screenshot', isLoggedIn, asyncHandler(addScreenshot));

router.get('/screenshot/all', isLoggedIn, asyncHandler(getAllScreenshot))

router.get('/favourite/all', isLoggedIn, asyncHandler(getAllFavourites));

router.patch('/:id/favourite', isLoggedIn, asyncHandler(addToFavourite));

router.patch('/:id/unfavourite', isLoggedIn, asyncHandler(removeFromFavourite));

router.get('/:photoid', isLoggedIn, asyncHandler(getSinglePhotoDetails))

router.delete('/delete/:id', isLoggedIn, asyncHandler(deletePhoto));


module.exports = router
