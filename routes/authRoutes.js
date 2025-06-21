const express = require('express')
const router = express.Router()
const asyncHandler = require('../utils/asyncHandler')
const {
    signUp,
    signIn,
    forgotPassword,
    verifyOTP,
    createNewPassword,
    deleteAccount,
} = require('../controllers/authController')


router.post('/sign-up', asyncHandler(signUp))
router.post('/sign-in', asyncHandler(signIn))
router.post('/forgot-password', asyncHandler(forgotPassword))
router.post('/verify-otp', asyncHandler(verifyOTP))
router.post('/reset-password', asyncHandler(createNewPassword))
router.post('/delete-account', asyncHandler(deleteAccount))


module.exports = router;