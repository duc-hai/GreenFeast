const express = require('express')
const env = require('dotenv')
const app = express()
const database = require('./config/connectMongo')
const routes = require('./routes')
const cookieParser = require('cookie-parser')

env.config()
database.connect()

app.use(express.urlencoded({ limit: '50mb', extended: true}))
app.use(express.json({ limit: '50mb' }))
app.use(cookieParser(process.env.COOKIE_SECRET))

const HOST = process.env.HOST || '0.0.0.0' || 'localhost'
const PORT = process.env.PORT || 3000

app.use('/api', routes)

app.listen(PORT, () => {
    console.log(`API Gateway is running at http://${HOST}:${PORT}`)
})