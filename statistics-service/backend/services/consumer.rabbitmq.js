const amqplib = require('amqplib')
const Order = require('../models/order')
const OnlineOrder = require('../models/online_order')

const receiveQueueOrder = async () => {
    const amqpUrl = process.env.AMQP_SERVER_URL_CLOUD || process.env.AMQP_SERVER_URL_DOCKER 
    // const amqpUrl = `amqp://${process.env.AMQP_SERVER_URL_HOST}:${process.env.AMQP_SERVER_URL_PORT}`
    try {
        //Create connection to AMQB Server (as well as Rabbit MQ Broker instance)
        const connect = await amqplib.connect(amqpUrl)

        console.log('Connect sucessfully with RabbitMQ')

        //Create channel
        const channel = await connect.createChannel()

        const queueName = 'statistics-order' //If not set, it will generate automatically
        
        //Create queue
        await channel.assertQueue(queueName, {
            durable: true, //Important. If it is 'false', then when the server is reset (reset container) or the crash app (services) in rabbit mq, the message will be lost. Set to 'true', the message will still exist -> Demonstrates the persistence of the message queue
        })

        //Receive data from queue
        //Buffer is a binary form of data, faster than regular objects, supports encoding
        await channel.consume(queueName, msg => {
            // console.log(`Message: ${msg.content.toString()}` )
            handleData(msg.content.toString())
        }, {
            noAck: true //The parameter is true or false to respond when receiving a message. For example, if set to false, when receiving a message the status will be unreceived. If run the app again, it will continue processing
            //Confirm whether the message has been received
        })
    }
    catch (err) {
        console.error(`Connection string: ${amqpUrl}`)
        console.error(`Rabbit MQ is error with message: ${err.message}`)
    }
}

const handleData = async (data) => {
    try {
        data = JSON.parse(data)
        const order = data?.order || null
        if (!order) return

        switch (data.type) {
            case 'offline':
                await new Order ({
                    menu_detail: order.menu_detail,
                    subtotal: order.subtotal,
                    discount: order.discount,
                    surcharge: order.surcharge,
                    note: order.note,
                    total: order.total,
                    table: order.table,
                    checkout: order.checkout,
                    payment_method: order.payment_method,
                    order_person: order.order_person
                }).save()
                break
            case 'online':
                await new OnlineOrder({
                    menu_detail: order.menu_detail,
                    subtotal: order.subtotal,
                    discount: order.discount,
                    surcharge: order.surcharge,
                    shippingfee: order.shippingfee,
                    total: order.total,
                    time: order.time,
                    payment_method: order.payment_method,
                    status: order.status,
                    order_person: order.order_person
                }).save()
                break
            default: 
                console.error('Data.type at rabbitmq is not valid')
        }
    }
    catch (err) {
        console.error(`Error occured at handleData rabbitmq: ${err.message}`)
    }
}

module.exports = {
    receiveQueueOrder
}