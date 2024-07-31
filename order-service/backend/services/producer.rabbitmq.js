const amqplib = require('amqplib')
const amqpUrl = process.env.AMQP_SERVER_URL_CLOUD || process.env.AMQP_SERVER_URL_DOCKER 

const sendQueueNotification = async (userId, title, message, link = '', broadcast = null) => {
    try {
        //boardcast is send noti for multi user, null is no, 1 is for restaurant, 2 is for customer
        if (!title || !message) return 

        const msg = { userId,  title, message, link, broadcast }

        //Create connection to AMQB Server (as well as Rabbit MQ Broker instance)
        const connect = await amqplib.connect(amqpUrl)

        //Create channel
        const channel = await connect.createChannel()

        const queueName = 'notification' //If not set, it will generate automatically
        
        //Create queue
        await channel.assertQueue(queueName, {
            durable: true, //Important. If it is 'false', then when the server rabbitmq is reset (reset container) or the crash app (services) in rabbit mq, the message will be lost. Set to 'true', the message will still exist -> Demonstrates the persistence of the message queue
        })

        //Send data to queue
        //Buffer is a binary form of data, faster than regular objects, supports encoding
        await channel.sendToQueue(queueName, Buffer.from(JSON.stringify(msg)), {
            expiration: '10000', // Time to live (TTL): 10s //If the queue remains unprocessed, it will be deleted (it's means error occurred)
            persistent: true //persistent, messages will be saved to disk or cache so that if an error occurs, the message will still be available. This parameter is required for durable to work
        })
    }
    catch (err) {
        console.error(`Rabbit MQ is error at sendQueueNotification with message: ${err.message}`)
    }
}

const sendQueueStatistics = async (type, order) => {
    try {
        if (!type || !order) return
        
        
        if (type === 'offline') {
            //Format menu to right format in statistics service
            let menuDetail = []
            for (let element of order.order_detail) {
                const menuDetailEachTimeOrder = element.menu.map(value => {
                    return { 
                        _id: value._id, 
                        name: value.name,
                        quantity: value.quantity,
                        price: value.price
                    }
                })
                menuDetail = [...menuDetail, ...menuDetailEachTimeOrder]
            }
            order.menu_detail = menuDetail
            delete order.order_detail
        }
        const msg = { type, order }

        //Create connection to AMQB Server (as well as Rabbit MQ Broker instance)
        const connect = await amqplib.connect(amqpUrl)

        //Create channel
        const channel = await connect.createChannel()

        const queueName = 'statistics-order' //If not set, it will generate automatically
        
        //Create queue
        await channel.assertQueue(queueName, {
            durable: true, //Important. If it is 'false', then when the server rabbitmq is reset (reset container) or the crash app (services) in rabbit mq, the message will be lost. Set to 'true', the message will still exist -> Demonstrates the persistence of the message queue
        })

        //Send data to queue
        //Buffer is a binary form of data, faster than regular objects, supports encoding
        await channel.sendToQueue(queueName, Buffer.from(JSON.stringify(msg)), {
            expiration: '10000', // Time to live (TTL): 10s //If the queue remains unprocessed, it will be deleted (it's means error occurred)
            persistent: true //persistent, messages will be saved to disk or cache so that if an error occurs, the message will still be available. This parameter is required for durable to work
        })
    }
    catch (err) {
        console.error(`Rabbit MQ is error at sendQueueStatistics with message: ${err.message}`)
    }
}

module.exports = {
    sendQueueNotification,
    sendQueueStatistics
}