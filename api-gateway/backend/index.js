const express = require('express')
const env = require('dotenv')
const app = express()
const database = require('./config/connect.mongo')
const routes = require('./routes')
const cookieParser = require('cookie-parser')
const session = require('express-session')

const HOST = process.env.HOST || '0.0.0.0' || 'localhost'
const PORT = process.env.PORT || 3000

env.config()
database.connect()

app.use(express.urlencoded({ limit: '50mb', extended: true}))
app.use(express.json({ limit: '50mb' }))
app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
}))

const cors = require('cors') 
app.use(cors({
    origin: ['http://localhost', 'http://greenfeast.space', 'https://greenfeast.space'],
    preflightContinue: true,
    credentials: true,
    optionsSuccessStatus: 200
}))

// app.use((req, res, next) => {
//     // Website you wish to allow to connect
//     res.setHeader('Access-Control-Allow-Origin', req.headers.origin);

//     // Request methods you wish to allow
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')

//     // Request headers you wish to allow
//     res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')

//     // Set to true if you need the website to include cookies in the requests sent
//     // to the API (e.g. in case you use sessions)
//     res.setHeader('Access-Control-Allow-Credentials', true)

//     // Pass to next layer of middleware
//     return next()
// })

app.use('/api', routes)

app.listen(PORT, () => {
    console.log(`API Gateway is running at http://${HOST}:${PORT}`)
})