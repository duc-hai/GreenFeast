const amqplib = require('amqplib')

class MenuService {
    async connectRabbitMQ() {
        try {
            const urlConnectRabbitMQ = process.env.AMQP_SERVER_URL_CLOUD || 'amqps://vasciktp:TaEL7NJrRzcI41xa3KqPD0FavkuCJUP5@armadillo.rmq.cloudamqp.com/vasciktp' || 'amqp://localhost:15672'

            //Create connection to AMQB Server (as well as Rabbit MQ Broker instance)
            const connection = await amqplib.connect(urlConnectRabbitMQ)

            //Create channel
            const channel = await connection.createChannel()

            const queueName = 'res_queue' //If not set, it will generate automatically

            await channel.assertQueue(queueName, {
                durable: false, //If it is 'false', then when the server is reset (reset container) or the app crash, the message will be lost. Set to 'true', the message will still exist -> Demonstrates the persistence of the message queue
            })

            channel.prefetch(1)

            return channel
        }
        catch(err) {
            console.log(err.message)
            throw new Error(`Error connecting to RabbitMQ: ${err.message}`)
        }
    }

    //Listen res data from service
    async listenResFromServie(channel) {
        try {
            const queueName = 'res_queue'

            await channel.consume(queueName, msg => {
                const correlationId = msg.proterties.correlationId

                if (correlationId == global.correlationId) {
                    const resData = msg.content.toString()

                    console.log('Received response from service:', resData)

                    //Trả kết quả cho client
                    // res.status(200).json({
                    //     resData
                    // })
                    // Ở đây có thể làm bất cứ điều gì với kết quả này, ví dụ trả về HTTP response
                    global.responseData = responseData
                }
            })
        }
        catch (err) {
            console.log(`Error listening response data: ${err.message}`)
        }
    }

    //Xử lý requets từ client và chuyển đến service
    async sendQueue (req, res) {
        try {
            const channel = await this.connectRabbitMQ()

            const reqQueueName = 'req_queue'
            const resQueueName = 'res_queue'
            const reqData = 'req_data' //Dữ liệu yêu cầu từ client

            // Tạo correlationId để phân biệt các yêu cầu
            global.correlationId = Math.random().toString()

            await this.listenResFromServie(channel)

            //Gửi yêu cầu đến service qua rabbit mq
            channel.sendToQueue(reqQueueName, Buffer.from(reqData), {
                correlationId: global.correlationId,
                replyTo: resQueueName // Đặt queue để nhận phản hồi từ service
            })

            console.log('Request sent to service:', requestData);

            // Chờ kết quả từ service và trả về cho client
            res.status(200).send('Request sent to service.');
        }
        catch (err) {
            console.log(`Error sending request to Rabbit MQ Server: ${err.message}`)
        }
    }
}

module.exports = new MenuService ()