import { Injectable } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitmqService {
    async sendMessage (queueName: string, data: any) {
        try {
            if (typeof (data) === 'object')
                data = JSON.stringify(data)

            const amqpUrl = process.env.AMQP_SERVER_URL_DOCKER || process.env.AMQP_SERVER_URL_CLOUD

            const connection = await amqp.connect(amqpUrl) //Create connection to AMQB Server (as well as Rabbit MQ Broker instance)
    
            const channel = await connection.createChannel() //Create channel
    
            await channel.assertQueue(queueName, {
                durable: true, //Important. If it is 'false', then when the server rabbitmq is reset (reset container) or the crash app (services) in rabbit mq, the message will be lost. Set to 'true', the message will still exist -> Demonstrates the persistence of the message queue
            })
    
            //Send data to queue
            //Buffer is a binary form of data, faster than regular objects, supports encoding
            channel.sendToQueue(queueName, Buffer.from(data), {
                expiration: '10000', // Time to live (TTL): 10s //If the queue remains unprocessed, it will be deleted (it's means error occurred)
                persistent: true //persistent, messages will be saved to disk or cache so that if an error occurs, the message will still be available. This parameter is required for durable to work
            })
           
            await channel.close()
            await connection.close()
        }
        catch (err) {
            console.error(`Error occured: ${err.message}`)
        }
    }
}
