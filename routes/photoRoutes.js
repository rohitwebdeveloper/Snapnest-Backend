const express = require('express')
const router = express.Router()
const upload = require('../config/multerConfig')
const asyncHandler = require('../utils/asyncHandler')
const isLoggedIn = require('../middlewares/isLoggedIn')
const {getPhotos, addPhotos} = require('../controllers/photoController')

router.post('/upload', isLoggedIn, upload.single('photo'), asyncHandler(addPhotos) )

router.get('/', isLoggedIn, asyncHandler(getPhotos) )




module.exports = router