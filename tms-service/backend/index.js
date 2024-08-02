const express = require('express')
const env = require('dotenv')
const app = express()
const routerTms = require('./routes/tms.route')
const database = require('./config/connect.mongo')
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger-output.json')
const consumer = require('./services/consumer.rabbitmq')

env.config()
database.connect()
app.use(express.urlencoded({ limit: '50mb', extended: true}))
app.use(express.json({ limit: '50mb' }))

consumer.receiveQueueNewOrder()
app.use('/tms/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile))
app.use('/tms', routerTms)

const HOST = process.env.HOST || '0.0.0.0' || 'localhost'
const PORT = process.env.PORT || 5010

app.listen(PORT, () => {
    console.log(`Tms service is running at http://${HOST}:${PORT}`)
})