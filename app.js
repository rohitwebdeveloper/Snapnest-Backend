 const express = require('express')
 const cookieParser = require('cookie-parser')
 const cors = require('cors')
 require('dotenv').config()
 const errorHandler = require('./middlewares/errorHandler')
 const authRoutes = require('./routes/authRoutes')

// Initialize express 
 const app = express()


//  Middlewares
 app.use(express.json())
 app.use(express.urlencoded({extended:true}))
 app.use(cors({origin:process.env.CLIENT_URL, credentials:true}))
 app.use(cookieParser())


//  Define Routes
 app.use('/api/auth', authRoutes)


//  Global error handler
 app.use(errorHandler)


module.exports = app

