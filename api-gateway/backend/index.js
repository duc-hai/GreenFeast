const express = require('express')
const env = require('dotenv')
const app = express()
const database = require('./database/connectMongo')
const routes = require('./routes')
const cookieParser = require('cookie-parser')

env.config()
database.connect()

app.use(express.urlencoded({ extended: true}))
app.use(express.json())
app.use(cookieParser(process.env.COOKIE_SECRET))

const HOST = process.env.HOST || 'localhost'
const PORT = process.env.PORT || 3000

app.use('/', routes)

app.listen(PORT, HOST, () => {
    console.log(`API Gateway is running at http://${HOST}:${PORT}`)
})