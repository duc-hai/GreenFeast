const amqplib = require('amqplib')
const { v4: uuidv4 } = require('uuid')
const Order = require('../models/order')
const OrderOnline = require('../models/online_order')
const Area = require('../models/area')
const producer = require('./producer.rabbitmq')
const StatusOnlineOrder = require('../enums/status.online.order')

const receiveQueue = async () => {
    const amqpUrl = process.env.AMQP_SERVER_URL_CLOUD || process.env.AMQP_SERVER_URL_DOCKER 
    // const amqpUrl = `amqp://${process.env.AMQP_SERVER_URL_HOST}:${process.env.AMQP_SERVER_URL_PORT}`
    try {
        //Create connection to AMQB Server (as well as Rabbit MQ Broker instance)
        const connect = await amqplib.connect(amqpUrl)

        console.log('Connect sucessfully with RabbitMQ')

        //Create channel
        const channel = await connect.createChannel()

        const queueName = 'management-order' //If not set, it will generate automatically
        
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

const receiveQueuePayment = async () => {
    const amqpUrl = process.env.AMQP_SERVER_URL_CLOUD || process.env.AMQP_SERVER_URL_DOCKER
    // const amqpUrl = `amqp://${process.env.AMQP_SERVER_URL_HOST}:${process.env.AMQP_SERVER_URL_PORT}`
    try {
        //Create connection to AMQB Server (as well as Rabbit MQ Broker instance)
        const connect = await amqplib.connect(amqpUrl)

        console.log('Connect sucessfully with RabbitMQ')

        //Create channel
        const channel = await connect.createChannel()

        const queueName = 'payment-order' //If not set, it will generate automatically
        
        //Create queue
        await channel.assertQueue(queueName, {
            durable: true, //Important. If it is 'false', then when the server is reset (reset container) or the crash app (services) in rabbit mq, the message will be lost. Set to 'true', the message will still exist -> Demonstrates the persistence of the message queue
        })

        //Receive data from queue
        //Buffer is a binary form of data, faster than regular objects, supports encoding
        await channel.consume(queueName, msg => {
            // console.log(`Message: ${msg.content.toString()}` )
            handleDataPayment(JSON.parse(msg.content.toString()))
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

const handleDataPayment = async message => {
    try {
        if (message.title !== 'payment') return null

        //Order at restaurant
        const order = await Order.findOne({ _id: message.data?.orderId, status: false })
        if (order) closeTable(message)
        else {
            const updatedOrder = await OrderOnline.findOneAndUpdate({ _id: message.data?.orderId, status: 0 }, { status: 2 }, { returnDocument: 'after' })

            producer.sendQueueStatistics('online', updatedOrder)
        }
    }
    catch (err) {
        console.error(`Error occured: ${err.message}`)
    }
}

const closeTable = async message => {
    try {
        if (message.title !== 'payment') return null
        
        const updateOrder = await Order.findOneAndUpdate({ _id: message.data?.orderId, status: false }, {
            payment_method: 'Transfer',
            status: true,
            checkout: new Date(),
            total: message.data?.amount,
            note: message.data?.note
        }, { returnDocument: 'after' }).lean()

        if (!updateOrder) return null
        
        await Area.findOneAndUpdate(
            { 'table_list._id': updateOrder.table },
            { $set: { 'table_list.$.status': 0 } }
        )

        producer.sendQueueNotification(null, 'Bàn đã được thanh toán', `Bàn ${updateOrder.table} tại nhà hàng đã được đóng bằng hình thức thanh toán VNPay`, '', 1)

        producer.sendQueueStatistics('offline', updateOrder)
    }
    catch (err) {
        console.error(`Error occured: ${err.message}`)
    }
}

const createTable = async (message) => {
    try {
        //With collection table, we need to add directly to the area collection
        const area = await require(`../models/area`).findOne({ _id: message?.data?.area_id })

        if (!area) return

        const table_list = area?.table_list

        table_list.push({
            _id: message?.data?.id,
            status: 0,
            slug: uuidv4()
        })

        await require(`../models/area`).findOneAndUpdate({ _id: message?.data?.area_id }, {
            table_list
        })
    }
    catch (err) {
        console.error(`Error occured: ${err.message}`)
    }
}

const createTableAuto = async (message) => {
    try {
        const area = await require(`../models/area`).findOne({ _id: message?.area_id })

        if (!area) return

        const table_list = area?.table_list

        message?.data.forEach(value => {
            table_list.push({
                _id: value.id,
                status: 0,
                slug: uuidv4()
            })
        })
            
        await require(`../models/area`).findOneAndUpdate({ _id: message?.area_id }, {
            table_list
        })
    }
    catch (err) {
        console.error(`Error occured: ${err.message}`)
    }
}

const handleData = async (message) => {
    try {
        if (typeof (message) === 'string')
            message = JSON.parse(message)
        
        if (message.title === 'table' && message.action === 'create') {
            await createTable(message)
            return
        }   
        else if (message.title === 'table' && message.action === 'createAuto') {
            createTableAuto(message)
            return
        }   
        // else if (message.title === 'table' && message.action === 'update') {
        //     //If you change to another area id, there will be an error
        //     await require(`../models/area`).findOneAndUpdate({ 'table_list._id': message?.id }, { $set: { 'table_list.$.name': message?.data?.name } })
        //     return
        // }     
        else if (message.title === 'table' && message.action === 'delete') {
            message?.ids.forEach(async value => {
                await require(`../models/area`).updateOne({
                    'table_list._id': value  //search conditions
                }, {
                    $pull: { 'table_list': { _id: value } }
                })
            })
            return
        }   

        const Model = require(`../models/${message.title}`)

        if (message.title === 'promotion') {
            handleAddDataPromotion(message)
        }
        else if (message.action === 'create') {
            const _id = message?.data?.id //ID in MySQL is 'id', while Mongo is '_id'

            delete message?.data?.id

            await new Model({...message.data, ...{ _id }}).save()  
        }
        else if (message.action === 'update') 
            await Model.findOneAndUpdate({ _id: message?.id }, message?.data)
        else if (message.action === 'delete') 
            await Model.deleteOne({ _id: message?.id })
    }
    catch (err) {
        console.error(`Error occured at consumer RabbitMQ: ${err.message}`)
    }
}

const handleAddDataPromotion = async (message) => {
    const Model = require(`../models/${message.title}`)
    switch (message.action) {
        case 'create': 
            if (message?.data?.form_promotion == 2) {
                //In case of promotion for a specific menu, we save the promotion directly in the table menu
                const menu = await require('../models/menu').findOne({ _id: message?.data?.condition_apply })
                let discount_price
                if (message?.data?.promotion_value.includes('%')) {
                    //Example: price is 100.000, promotion value is -20%, it's mean price which customer have to pay is 80.000
                    discount_price = Math.floor((100 + parseInt(message?.data?.promotion_value.replace('%', ''))) / 100 * menu?.price)
                }
                else {
                    discount_price = menu?.price + parseInt(message?.data?.promotion_value)
                }
                
                await require('../models/menu').findOneAndUpdate({ _id: message?.data?.condition_apply }, { discount_price })
            }
            else {
                //In the remaining cases, we save it to the database like a normal table
                const _id = message?.data?.id //ID in MySQL is 'id', while Mongo is '_id'

                delete message?.data?.id
        
                await new Model({...message.data, ...{ _id }}).save() 
            }
            break
        case 'update':
            //May be have error here
            if (message?.data?.form_promotion &&  message?.data?.form_promotion== 2) {
                //In case of promotion for a specific menu, we save the promotion directly in the table menu
                const menu = await require('../models/menu').findOne({ _id: message?.data?.condition_apply })
                let discount_price
                if (message?.data?.promotion_value.includes('%')) {
                    //Example: price is 100.000, promotion value is -20%, it's mean price which customer have to pay is 80.000
                    discount_price = Math.floor((100 + parseInt(message?.data?.promotion_value.replace('%', ''))) / 100 * menu?.price)
                }
                else {
                    discount_price = menu?.price + parseInt(message?.data?.promotion_value)
                }
                
                await require('../models/menu').findOneAndUpdate({ _id: message?.data?.condition_apply }, { discount_price })
            }
            else
                //In the remaining cases, we save it to the database like a normal table
                await Model.findOneAndUpdate({ _id: message?.id }, message?.data)
            break
        case 'delete':
            if (message?.data?.form_promotion &&  message?.data?.form_promotion== 2) {
                await require('../models/menu').findOneAndUpdate({ _id: message?.data?.condition_apply }, { discount_price: '' })
            }
            else 
                await Model.deleteOne({ _id: message?.id })
            break
    }
}

const receiveQueueTms = async () => {
    const amqpUrl = process.env.AMQP_SERVER_URL_CLOUD || process.env.AMQP_SERVER_URL_DOCKER 
    // const amqpUrl = `amqp://${process.env.AMQP_SERVER_URL_HOST}:${process.env.AMQP_SERVER_URL_PORT}`
    try {
        //Create connection to AMQB Server (as well as Rabbit MQ Broker instance)
        const connect = await amqplib.connect(amqpUrl)

        console.log('Connect sucessfully with RabbitMQ')

        //Create channel
        const channel = await connect.createChannel()

        const queueName = 'order-tms' //If not set, it will generate automatically
        
        //Create queue
        await channel.assertQueue(queueName, {
            durable: true, //Important. If it is 'false', then when the server is reset (reset container) or the crash app (services) in rabbit mq, the message will be lost. Set to 'true', the message will still exist -> Demonstrates the persistence of the message queue
        })

        //Receive data from queue
        //Buffer is a binary form of data, faster than regular objects, supports encoding
        await channel.consume(queueName, msg => {
            // console.log(`Message: ${msg.content.toString()}` )
            handleDataTms(msg.content.toString())
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

const handleDataTms = async(data) => {
    try {
        data = JSON.parse(data)

        const orderOnline = await OrderOnline.findOneAndUpdate({ _id: data.orderId }, { status: data.status, delivery_notes: data.note || '' }, { returnDocument: 'after' })

        producer.sendQueueNotification(orderOnline.order_person?._id, 'Cập nhật trạng thái vận chuyển!', `Đơn hàng ${orderOnline._id} của bạn đã cập nhật trạng thái thành ${StatusOnlineOrder[orderOnline.status]}`)

        producer.sendQueueNotification(null, 'Cập nhật trạng thái vận chuyển!', `Trạng thái giao hàng của đơn hàng ${orderOnline._id} đã cập nhật thành ${StatusOnlineOrder[orderOnline.status]}`, '', 1)

        producer.sendQueueStatusOrder(orderOnline._id, StatusOnlineOrder[orderOnline.status], orderOnline.order_person?._id)
    }
    catch (err) {
        console.error(`Error occured at consumer handleDataTms: ${err.message}`)
    }
}

module.exports = {
    receiveQueue, receiveQueuePayment, receiveQueueTms
}