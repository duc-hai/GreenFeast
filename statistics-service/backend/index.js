const express = require('express')
const env = require('dotenv')
const app = express()
const routerStatistics = require('./routes/statistics.route')
const database = require('./config/connect.mongo')
const consume = require('./services/consumer.rabbitmq')

env.config()
database.connect()
consume.receiveQueue()
app.use(express.urlencoded({ limit: '50mb', extended: true}))
app.use(express.json({ limit: '50mb' }))

app.use('/statistics', routerStatistics)

const HOST = process.env.HOST || '0.0.0.0' || 'localhost'
const PORT = process.env.PORT || 5030

app.listen(PORT, () => {
    console.log(`Statistics service is running at http://${HOST}:${PORT}`)
})