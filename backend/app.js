const express = require('express')
const app = express()
const errorMiddleware = require('./middlwares/errorMiddleware')
const cookieParser = require('cookie-parser')

app.use(express.json())
app.use(cookieParser())


// Routes
app.use('/api/v1/user', require('./routes/userRoutes'))

// Error Middleware
app.use(errorMiddleware)



module.exports = app;
