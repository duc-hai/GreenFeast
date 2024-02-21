const express = require('express')
const env = require('dotenv')
const app = express()
const database = require('./config/connect.mongo')
const routes = require('./routes')
const cookieParser = require('cookie-parser')
const session = require('express-session')

env.config()
database.connect()

app.use(express.urlencoded({ limit: '50mb', extended: true}))
app.use(express.json({ limit: '50mb' }))
app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
}));

const HOST = process.env.HOST || '0.0.0.0' || 'localhost'
const PORT = process.env.PORT || 3000

app.use('/api', routes)

app.listen(PORT, () => {
    console.log(`API Gateway is running at http://${HOST}:${PORT}`)
})