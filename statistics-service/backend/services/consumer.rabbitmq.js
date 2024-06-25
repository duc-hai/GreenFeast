const amqplib = require('amqplib')

const receiveQueue = async () => {
    const amqpUrl = process.env.AMQP_SERVER_URL_CLOUD || process.env.AMQP_SERVER_URL_DOCKER 
    // const amqpUrl = `amqp://${process.env.AMQP_SERVER_URL_HOST}:${process.env.AMQP_SERVER_URL_PORT}`
    try {
        //Create connection to AMQB Server (as well as Rabbit MQ Broker instance)
        const connect = await amqplib.connect(amqpUrl)

        console.log('Connect sucessfully with RabbitMQ')

        //Create channel
        const channel = await connect.createChannel()

        const queueName = 'email' //If not set, it will generate automatically
        
        //Create queue
        await channel.assertQueue(queueName, {
            durable: true, //Important. If it is 'false', then when the server is reset (reset container) or the crash app (services) in rabbit mq, the message will be lost. Set to 'true', the message will still exist -> Demonstrates the persistence of the message queue
        })

        //Receive data from queue
        //Buffer is a binary form of data, faster than regular objects, supports encoding
        await channel.consume(queueName, msg => {
            // console.log(`Message: ${msg.content.toString()}` )
            // handleData(msg.content.toString())
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

module.exports = {
    receiveQueue
}