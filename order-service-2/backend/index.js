const express = require('express')
const env = require('dotenv')
const app = express()
const database = require('./config/connect.mongo')
const routes = require('./routes')
const consumer = require('./services/consumer.rabbitmq')
const cookieParser = require('cookie-parser')

env.config()
database.connect()
//producer.sendQueue('') //If app close or crash, connection will be closed automatic
setTimeout(() => consumer.receiveQueue(), 0)
setTimeout(() => consumer.receiveQueuePayment(), 0)
setTimeout(() => consumer.receiveQueueTms(), 0)

app.use(express.urlencoded({ limit: '50mb', extended: true}))
app.use(express.json({ limit: '50mb' }))
app.use(cookieParser(process.env.COOKIE_SECRET))

const HOST = process.env.HOST || '0.0.0.0' || 'localhost'
const PORT = process.env.PORT || 5001

app.use('/', routes)

app.listen(PORT, () => {
    console.log(`Order service 2 is running at http://${HOST}:${PORT}`)
})