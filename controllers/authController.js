const userModel = require('../models/userModel')
const { emailRegex, passwordRegex } = require('../utils/validation')
const bcrypt = require('bcryptjs')
const generateToken = require('../utils/generateToken')
const otpModel = require('../models/otpModel')



const signUp = async (req, res) => {
    const { name, email, password } = req.body;

    if (!emailRegex.test(email)) return res.status(400).json({ success: false, message: 'Invalid email format' })
    if (!passwordRegex.test(password)) return res.status(400).json({ success: false, message: 'Weak Password' })

    const userexist = await userModel.findOne({ email: email })
    if (userexist) {
        return res.status(400).json({ message: 'Account already exists' })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const newuser = new userModel({
        name: name,
        email: email,
        password: hashedPassword
    })
    await newuser.save()

    const token = await generateToken(newuser.email, newuser._id)
    res.cookie('snapnestToken', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 86400000
    })

    const user = newuser.toObject();
    delete user.password;
    delete user.isVerified;

    return res.status(201).json({ success: true, message: 'SignUp sucessful', user })

}


const signIn = async (req, res) => {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email: email })
    if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid email' })
    }

    const passMatched = await bcrypt.compare(password, user.password)
    if (!passMatched) {
        return res.status(401).json({ success: false, message: 'Invalid password' })
    } else {
        let token = await generateToken(user.email, user._id)
        res.cookie('snapnestToken', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 86400000
        })
        const userdata = user.toObject();
        delete userdata.password;
        delete userdata.isVerified;
        return res.status(200).json({ success: true, message: 'LogIn successful', userdata })
    }
}


const forgotPassword = async (req, res) => {

    const { email } = req.body;
    if (!email) return res.status(404).json({ message: 'Please enter email' })

    const user = await userModel.findOne({ email: email })
    if (!user) return res.status(404).json({ success: false, message: 'OTP sent to your email if account exists' })

    const otp = Math.floor((Math.random() * 900000) + 100000)
    const newotp = await otpModel.findOneAndUpdate(
        { email: user.email },
        { otp: otp },
        { upsert: true, new: true })

    if (!newotp) {
        return res.status(500).json({ success: false, message: 'Failed to send otp' })
    }

    //   await send mail
    return res.status(200).json({ success: true, message: 'OTP has been sent ' })

}



const verifyOTP = async (req, res) => {
    const { email, otp } = req.body;

    if (!otp) {
        return res.status(400).json({ message: "OTP is required." });
    }

    const sentOtp = await otpModel.findOne({ email: email })
    if (!sentOtp) {
        return res.status(404).json({ message: 'OTP has been expired' })
    }
    if (sentOtp === otp) {
        return res.status(200).json({ sucess: true, message: 'OTP Verifed Successfully' })
    } else {
        return res.status(401).json({ sucess: false, message: 'Invalid OTP' })
    }
}


const createNewPassword = async (req, res) => {

    const { email, confirmpassword } = req.body;
    if (!confirmpassword) {
        return res.status(401).json({ message: "Password is required" });
    }

    if (!passwordRegex.test(confirmpassword)) {
        return res.status(400).json({ message: 'Weak Password' })
    }
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(confirmpassword, salt)
    const updatedUser = await userModel.findOneAndUpdate(
        { email: email },
        { password: hashedPassword },
        { new: true })
    if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' })
    }
    return res.status(200).json({ success: true, message: "New password created successfully" })
}



const deleteAccount = async (req, res) => {
    const { email } = req.user;

    const deletedUser = await userModel.deleteOne({ email: email })
    if (deletedUser.deletedCount === 0) {
        return res.status(404).json({ success: false, message: 'Account not found' })
    }
    res.clearCookie('snapnestToken', {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
    })
    return res.status(200).json({ success: true, message: 'Account deleted successfully' })
}


const verifyUser = async (req, res) => {
    res.status(200).json({ user: req.user });
};



const logOut = async (req, res) => {
    res.clearCookie('snapnestToken', {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
    })

    return res.status(200).json({
        success: true,
        message: 'Logged out successfully',
    })
}


module.exports = {
    signUp,
    signIn,
    forgotPassword,
    verifyOTP,
    createNewPassword,
    deleteAccount,
    verifyUser,
    logOut
}



