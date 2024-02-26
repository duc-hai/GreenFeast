const express = require('express')
const env = require('dotenv')
const app = express()
const database = require('./config/connect.mongo')
const routes = require('./routes')
const producer = require('./config/producer.rabbitmq')
const consumer = require('./config/consumer.rabbitmq')

env.config()
database.connect()
producer.sendQueue('Hé lô') //If app close or crash, connection will be closed automatic
consumer.receiveQueue()

app.use(express.urlencoded({ limit: '50mb', extended: true}))
app.use(express.json({ limit: '50mb' }))

const HOST = process.env.HOST || '0.0.0.0' || 'localhost'
const PORT = process.env.PORT || 3000

app.use('/', routes)

app.listen(PORT, () => {
    console.log(`Order service is running at http://${HOST}:${PORT}`)
})