const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const helmet = require('helmet')
const compression = require('compression')
const hpp = require('hpp')
const rateLimit = require('express-rate-limit')
const errorHandler = require('./middlewares/errorHandler')
const authRoutes = require('./routes/authRoutes')
const photoRoutes = require('./routes/photoRoutes')
const albumRoutes = require('./routes/albumRoutes')
const documentRoutes = require('./routes/documentRoutes')
const userRoutes = require('./routes/userRoutes')


// Initialize express 
const app = express()

app.set('trust proxy', 1)

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}))

app.options('*', cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}))

// Security middlewares
app.use(helmet())
app.use(hpp())


// Rate Limiter to limit the request by user
// const limiter = rateLimit({
//    windowMs: 600000,
//     max: 100,
//     message: "Too many requests from your side, please try again later",
//     standardHeaders: true,
//     legacyHeaders: false,
// })
// app.use(limiter)

// Compress data sent on request
app.use(compression())


//  Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
//app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }))
app.use(cookieParser())


//  Define Routes
// app.use('/api/auth', authRoutes)
// app.use('/api/photo', photoRoutes)
// app.use('/api/album', albumRoutes)
// app.use('/api/document', documentRoutes)
// app.use('/api/user', userRoutes)



//  Global error handler
app.use(errorHandler)


module.exports = app

