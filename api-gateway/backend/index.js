const express = require('express')
const env = require('dotenv')
const app = express()
const database = require('./config/connect.mongo')
const routes = require('./routes')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const cors = require('cors') 
const HOST = process.env.HOST || '0.0.0.0' || 'localhost'
const PORT = process.env.PORT || 3000
const compression = require('compression')

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

//Allow cross origin resource sharing
app.use(cors({
    origin: ['http://localhost', 'http://greenfeast.space', 'https://greenfeast.space', 'http://localhost:3000', 'http://localhost:3001', 'http://localhost:5010'], //Url we wish to allow to connect
    preflightContinue: true,
    credentials: true, //true: website to include cookies in the requests sent, session
    optionsSuccessStatus: 200
}))

app.use(compression({
    level: 6, //The higher the level, the more thorough the compression, but heavier on the server (due to calculations, it consumes space, so set = 6)
    threshold: 100 * 1000, // byte unit, if larger than this unit then compress, otherwise it won't work
    filter: (req, res) => {
        //filter the compress req
        if (req.headers['x-no-compress']) return false //No compress
        return compression.filter(req, res)
    }
}))

app.use('/api', routes)

app.listen(PORT, () => {
    console.log(`API Gateway is running at http://${HOST}:${PORT}`)
})