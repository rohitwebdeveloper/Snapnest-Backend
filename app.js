 const express = require('express')
 const cookieParser = require('cookie-parser')
 const cors = require('cors')
 require('dotenv').config()
 const errorHandler = require('./middlewares/errorHandler')
 const authRoutes = require('./routes/authRoutes')
 const photoRoutes = require('./routes/photoRoutes')
 const albumRoutes = require('./routes/albumRoutes')
 const documentRoutes = require('./routes/documentRoutes')
 const userRoutes = require('./routes/userRoutes')
 

// Initialize express 
 const app = express()


//  Middlewares
 app.use(express.json())
 app.use(express.urlencoded({extended:true}))
 app.use(cors({origin:process.env.CLIENT_URL, credentials:true}))
 app.use(cookieParser())


//  Define Routes
 app.use('/api/auth', authRoutes)
 app.use('/api/photo', photoRoutes)
 app.use('/api/album', albumRoutes)
 app.use('/api/document', documentRoutes)
 app.use('/api/user', userRoutes)
 


//  Global error handler
 app.use(errorHandler)


module.exports = app

