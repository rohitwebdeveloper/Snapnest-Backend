require('dotenv').config({ path: '../.env' });
const app = require('./app')
const port = process.env.PORT || 8000
const dbConnect = require('./config/dbConfig')


;(async () => {
    try {
        await dbConnect()
        console.log('Connected to database')
        app.listen(port, () => console.log(`Server running on port ${port}`))
    } catch (error) {
        console.log('Failed to start server:', error)
        process.exit(1)
    }
})()
 