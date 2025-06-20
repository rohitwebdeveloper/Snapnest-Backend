const mongoose = require('mongoose')

const dbConnect = async () => {
   await mongoose.connect(process.env.DATABASE_URL)
}

module.exports = dbConnect