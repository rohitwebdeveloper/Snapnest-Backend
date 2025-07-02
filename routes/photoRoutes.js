const express = require('express')
const router = express.Router()
const upload = require('../config/multerConfig')
const asyncHandler = require('../utils/asyncHandler')
const isLoggedIn = require('../middlewares/isLoggedIn')
const {getPhotos, addPhotos, getSinglePhotoDetails, updatephotodetails, addScreenshot} = require('../controllers/photoController')


router.post('/upload', isLoggedIn, upload.single('photo'), asyncHandler(addPhotos) )

router.get('/', isLoggedIn, asyncHandler(getPhotos) )

router.get('/:photoid', isLoggedIn, asyncHandler(getSinglePhotoDetails) )

router.put('/update-detail', isLoggedIn, asyncHandler(updatephotodetails))

router.put('/add-screenshot', isLoggedIn, asyncHandler(addScreenshot));

module.exports = router