const amqplib = require('amqplib')
const axios = require('axios')
const Order = require('../models/order')
require('dotenv').config()

const receiveQueueNewOrder = async () => {
    const amqpUrl = process.env.AMQP_SERVER_URL_CLOUD || process.env.AMQP_SERVER_URL_DOCKER 
    // const amqpUrl = `amqp://${process.env.AMQP_SERVER_URL_HOST}:${process.env.AMQP_SERVER_URL_PORT}`
    try {
        //Create connection to AMQB Server (as well as Rabbit MQ Broker instance)
        const connect = await amqplib.connect(amqpUrl)

        console.log('Connect sucessfully with RabbitMQ')

        //Create channel
        const channel = await connect.createChannel()

        const queueName = 'neworder-tms' //If not set, it will generate automatically
        
        //Create queue
        await channel.assertQueue(queueName, {
            durable: true, //Important. If it is 'false', then when the server is reset (reset container) or the crash app (services) in rabbit mq, the message will be lost. Set to 'true', the message will still exist -> Demonstrates the persistence of the message queue
        })

        //Receive data from queue
        //Buffer is a binary form of data, faster than regular objects, supports encoding
        await channel.consume(queueName, msg => {
            // console.log(`Message: ${msg.content.toString()}` )
            handleNewOrder(msg.content.toString())
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

const handleNewOrder = async data => {
    try {
        data = JSON.parse(data).order || JSON.parse(data)
        const order = (await storageNewOrderData(data)).toObject()

        //Delete properties which not essential
        delete order.createdAt
        delete order.updatedAt
        delete order.__v
        delete order.send_tms

        await sendNewOrderToTms(order)
    }
    catch (err) {
        console.error(`Error occured at handleNewOrder: ${err.message}`)
    }
}

const sendNewOrderToTms = async order => {
    const response = await axios.post(process.env.TMS_NEW_ORDER_URL, order)
    // console.log('Response:', response)
    // console.log('Response:', response.data)
    if (response.data?.statusCode == 200 || response.status == 200)
        await Order.findOneAndUpdate({ _id: order._id}, { send_tms: true })
}

const storageNewOrderData = async data => {
    if (!data) return null
    try {
        const menuDetail = data.menu_detail.map(menu => {
            return { _id: menu._id, name: menu.name, quantity: menu.quantity }
        })

        const order = await new Order({
            menu_detail: menuDetail,
            shipping_fee: data.shippingfee,
            note: data.note,
            payment_method: data.payment_method == 'cod' ? 'Thanh toán khi nhận hàng' : 'Đã chuyển khoản',
            delivery_information: {
                name: data.delivery_information.name,
                phone_number: data.delivery_information.phone_number,
                district: data.delivery_information.district,
                ward: data.delivery_information.ward,
                street: data.delivery_information.address,
                total: data.toal,
                cod_amount: data.payment_method == 'cod' ? data.total : 0,
                status: data.status
            }
        }).save()

        return order
    }
    catch (err) {
        console.error(`Error occured at storageNewOrderData: ${err.message}`)
    }
}

module.exports = {
    receiveQueueNewOrder, 
}