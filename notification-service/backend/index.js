const express = require('express')
const env = require('dotenv')
const app = express()
const routerNotification = require('./routes/notification.route')
const database = require('./config/connect.mongo')

env.config()
database.connect()
app.use(express.urlencoded({ limit: '50mb', extended: true}))
app.use(express.json({ limit: '50mb' }))

app.use('/notification', routerNotification)

const HOST = process.env.HOST || '0.0.0.0' || 'localhost'
const PORT = process.env.PORT || 5020

app.listen(PORT, () => {
    console.log(`Notification service is running at http://${HOST}:${PORT}`)
})