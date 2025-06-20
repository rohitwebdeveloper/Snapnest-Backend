 const express = require('express')
 const cookieParser = require('cookie-parser')
 const cors = require('cors')
 require('dotenv').config()
 const errorHandler = require('./middlewares/errorHandler')


 const app = express()


 app.use(express.json())
 app.use(express.urlencoded({extended:true}))
 app.use(cors({origin:process.env.CLIENT_URL, credentials:true}))
 app.use(cookieParser())


 app.use(errorHandler)


module.exports = app

