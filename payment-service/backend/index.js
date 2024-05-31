const express = require('express')
const env = require('dotenv')
const app = express()
const routerPayment = require('./routes/payment.route')
const database = require('./config/connect.mongo')

env.config()
database.connect()
app.use(express.urlencoded({ limit: '50mb', extended: true}))
app.use(express.json({ limit: '50mb' }))

app.use('/payment', routerPayment)

const HOST = process.env.HOST || '0.0.0.0' || 'localhost'
const PORT = process.env.PORT || 5005

app.listen(PORT, () => {
    console.log(`Payment service is running at http://${HOST}:${PORT}`)
})