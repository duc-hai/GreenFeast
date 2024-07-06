const amqplib = require('amqplib')
const amqpUrl = process.env.AMQP_SERVER_URL_DOCKER || process.env.AMQP_SERVER_URL_CLOUD

const sendQueue = async (msg) => {
    try {
        //Create connection to AMQB Server (as well as Rabbit MQ Broker instance)
        const connect = await amqplib.connect(amqpUrl)

        //Create channel
        const channel = await connect.createChannel()

        const queueName = 'payment-order' //If not set, it will generate automatically
        
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
        console.error(`Rabbit MQ is error with message: ${err.message}`)
    }
}

module.exports = {
    sendQueue
}