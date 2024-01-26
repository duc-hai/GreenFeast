const express = require('express')
const env = require('dotenv')
const app = express()
const database = require('./database/connectMongo.js')
const routes = require('./routes')

app.use(express.urlencoded({ extended: true}))
app.use(express.json())

env.config()
database.connect()

const HOST = process.env.HOST || 'localhost'
const PORT = process.env.PORT || 3000

app.use('/', routes)

app.listen(PORT, HOST, () => {
    console.log(`API Gateway is running at http://${HOST}:${PORT}`)
})