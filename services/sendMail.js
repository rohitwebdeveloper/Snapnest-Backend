const nodemailer = require("nodemailer")

const tranporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_PASSWORD
    }
})


const sendMailToUser = async (useremail, code) => {
    try {
        await tranporter.sendMail({
            from: process.env.SENDER_EMAIL,
            to: useremail,
            subject: 'Verification for password recovery',
            html: ` <h3>Dear User,</h3>
        <p>Hello, You recently requested to reset your password for your account with Snapnest. To complete the password reset process, please use the following verification code: </p>
        <p> Verification Code: <b>${code}</b></p>
        <p>Please enter this code on the password reset page to proceed with resetting your password.</p>
        <p>With regards, Team Snapnest</p>
        `
        })
    } catch (error) {
        console.log(error)
        throw new Error('Failed to send mail')
    }
}


module.exports = sendMailToUser