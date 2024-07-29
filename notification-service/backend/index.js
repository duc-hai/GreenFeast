const express = require('express')
const env = require('dotenv')
const app = express()
const routerNotification = require('./routes/notification.route')
const database = require('./config/connect.mongo')
const consume = require('./services/consumer.rabbitmq')
const ejs = require('ejs')
const path = require('path')

env.config()
database.connect()
consume.receiveQueue()
consume.receiveQueueNotification()
consume.receiveQueueUser()
// app.use(express.static(__dirname + '/public'))
app.set('view engine', 'ejs')
app.set('views', './views')
app.use(express.urlencoded({ limit: '50mb', extended: true}))
app.use(express.json({ limit: '50mb' }))

app.use('/notification', routerNotification)

const HOST = process.env.HOST || '0.0.0.0' || 'localhost'
const PORT = process.env.PORT || 5020

app.listen(PORT, () => {
    console.log(`Notification service is running at http://${HOST}:${PORT}`)
})