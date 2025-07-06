const express = require('express')
const router = express.Router()
const upload = require('../config/multerConfig')
const asyncHandler = require('../utils/asyncHandler')
const isLoggedIn = require('../middlewares/isLoggedIn')
const {uploadProfileImage} = require('../controllers/userController')


router.post('/upload-profile-image', isLoggedIn, upload.single('photo'), asyncHandler(uploadProfileImage))


module.exports = router