const amqplib = require("amqplib")
const emailService = require("./email.service")
const User = require("../models/user.js")
const notificationService = require("./notification.service.js")

const receiveQueueUser = async () => {
  const amqpUrl =
    process.env.AMQP_SERVER_URL_CLOUD || process.env.AMQP_SERVER_URL_DOCKER
  // const amqpUrl = `amqp://${process.env.AMQP_SERVER_URL_HOST}:${process.env.AMQP_SERVER_URL_PORT}`
  try {
    //Create connection to AMQB Server (as well as Rabbit MQ Broker instance)
    const connect = await amqplib.connect(amqpUrl)

    console.log("Connect sucessfully with RabbitMQ")

    //Create channel
    const channel = await connect.createChannel()

    const queueName = "gateway-notification" //If not set, it will generate automatically

    //Create queue
    await channel.assertQueue(queueName, {
      durable: true, //Important. If it is 'false', then when the server is reset (reset container) or the crash app (services) in rabbit mq, the message will be lost. Set to 'true', the message will still exist -> Demonstrates the persistence of the message queue
    })

    //Receive data from queue
    //Buffer is a binary form of data, faster than regular objects, supports encoding
    await channel.consume(
      queueName,
      (msg) => {
        // console.log(`Message: ${msg.content.toString()}` )
        handleDataUser(msg.content.toString())
      },
      {
        noAck: true, //The parameter is true or false to respond when receiving a message. For example, if set to false, when receiving a message the status will be unreceived. If run the app again, it will continue processing
        //Confirm whether the message has been received
      }
    )
  } catch (err) {
    console.error(`Connection string: ${amqpUrl}`)
    console.error(`Rabbit MQ is error with message: ${err.message}`)
  }
}

const handleDataUser = async (data) => {
  try {
    data = JSON.parse(data)
    new User({
      _id: data.userId,
      user_type: data.user_type,
      role: data.role,
    }).save()
  } catch (error) {
    console.error(`Error occurred at handleDataUser: ${error.message}`)
  }
}

const receiveQueue = async () => {
  const amqpUrl =
    process.env.AMQP_SERVER_URL_CLOUD || process.env.AMQP_SERVER_URL_DOCKER
  // const amqpUrl = `amqp://${process.env.AMQP_SERVER_URL_HOST}:${process.env.AMQP_SERVER_URL_PORT}`
  try {
    //Create connection to AMQB Server (as well as Rabbit MQ Broker instance)
    const connect = await amqplib.connect(amqpUrl)

    console.log("Connect sucessfully with RabbitMQ")

    //Create channel
    const channel = await connect.createChannel()

    const queueName = "email" //If not set, it will generate automatically

    //Create queue
    await channel.assertQueue(queueName, {
      durable: true, //Important. If it is 'false', then when the server is reset (reset container) or the crash app (services) in rabbit mq, the message will be lost. Set to 'true', the message will still exist -> Demonstrates the persistence of the message queue
    })

    //Receive data from queue
    //Buffer is a binary form of data, faster than regular objects, supports encoding
    await channel.consume(
      queueName,
      (msg) => {
        // console.log(`Message: ${msg.content.toString()}` )
        handleData(msg.content.toString())
      },
      {
        noAck: true, //The parameter is true or false to respond when receiving a message. For example, if set to false, when receiving a message the status will be unreceived. If run the app again, it will continue processing
        //Confirm whether the message has been received
      }
    )
  } catch (err) {
    console.error(`Connection string: ${amqpUrl}`)
    console.error(`Rabbit MQ is error with message: ${err.message}`)
  }
}

const receiveQueueNotification = async () => {
  const amqpUrl =
    process.env.AMQP_SERVER_URL_CLOUD || process.env.AMQP_SERVER_URL_DOCKER
  // const amqpUrl = `amqp://${process.env.AMQP_SERVER_URL_HOST}:${process.env.AMQP_SERVER_URL_PORT}`
  try {
    //Create connection to AMQB Server (as well as Rabbit MQ Broker instance)
    const connect = await amqplib.connect(amqpUrl)

    console.log("Connect sucessfully with RabbitMQ")

    //Create channel
    const channel = await connect.createChannel()

    const queueName = "notification" //If not set, it will generate automatically

    //Create queue
    await channel.assertQueue(queueName, {
      durable: true, //Important. If it is 'false', then when the server is reset (reset container) or the crash app (services) in rabbit mq, the message will be lost. Set to 'true', the message will still exist -> Demonstrates the persistence of the message queue
    })

    //Receive data from queue
    //Buffer is a binary form of data, faster than regular objects, supports encoding
    await channel.consume(
      queueName,
      (msg) => {
        // console.log(`Message: ${msg.content.toString()}`)
        notificationService.storageDatabaseNotification(msg.content.toString())
      },
      {
        noAck: true, //The parameter is true or false to respond when receiving a message. For example, if set to false, when receiving a message the status will be unreceived. If run the app again, it will continue processing
        //Confirm whether the message has been received
      }
    )
  } catch (err) {
    console.error(`Connection string: ${amqpUrl}`)
    console.error(`Rabbit MQ is error with message: ${err.message}`)
  }
}

const handleData = async (message) => {
  try {
    message = JSON.parse(message)
    let subject = "",
      text = ""
    if (message.action === "verify") {
      (subject = "Xác thực email cho website GreenFeast"),
        (text = `Mã xác thực của bạn là <b>${message.otp}</b>, OTP có hiệu lực trong 5 phút, vui lòng không cung cấp OTP cho bất cứ ai.`)
      emailService.sendMail(message.email, subject, text)
    } else if (message.action === "promotion") {
      subject = "Giảm giá đặc biệt tại Green Feast"
      text = message.text
      const emailList = await getUserListEmail()
      emailService.sendMailPromotion(emailList, subject, text)
    } else if (message.action === "add") {
      await new User({
        _id: message.userId,
        email: message.email,
      }).save()
    }
  } catch (err) {
    console.error(`Error occured at consumer RabbitMQ: ${err.message}`)
  }
}

const getUserListEmail = async () => {
  try {
    const users = await User.find().lean()
    const emails = users.map((value) => value.email)
    return emails
  } catch (err) {
    console.error(`Error occured at consumer RabbitMQ: ${err.message}`)
  }
}

const receiveQueueStatusOrder = async () => {
  const amqpUrl =
    process.env.AMQP_SERVER_URL_CLOUD || process.env.AMQP_SERVER_URL_DOCKER
  // const amqpUrl = `amqp://${process.env.AMQP_SERVER_URL_HOST}:${process.env.AMQP_SERVER_URL_PORT}`
  try {
    //Create connection to AMQB Server (as well as Rabbit MQ Broker instance)
    const connect = await amqplib.connect(amqpUrl)

    console.log("Connect sucessfully with RabbitMQ")

    //Create channel
    const channel = await connect.createChannel()

    const queueName = "order-noti" //If not set, it will generate automatically

    //Create queue
    await channel.assertQueue(queueName, {
      durable: true, //Important. If it is 'false', then when the server is reset (reset container) or the crash app (services) in rabbit mq, the message will be lost. Set to 'true', the message will still exist -> Demonstrates the persistence of the message queue
    })

    //Receive data from queue
    //Buffer is a binary form of data, faster than regular objects, supports encoding
    await channel.consume(
      queueName,
      (msg) => {
        // console.log(`Message: ${msg.content.toString()}` )
        handleMailStatusOrder(msg.content.toString())
      },
      {
        noAck: true, //The parameter is true or false to respond when receiving a message. For example, if set to false, when receiving a message the status will be unreceived. If run the app again, it will continue processing
        //Confirm whether the message has been received
      }
    )
  } catch (err) {
    console.error(`Connection string: ${amqpUrl}`)
    console.error(`Rabbit MQ is error with message: ${err.message}`)
  }
}

const handleMailStatusOrder = async (data) => {
  try {
    data = JSON.parse(data)
    const user = await User.findOne({ _id: data.userId }).lean()
    if (!user) return null
    await emailService.sendMail(
      user.email,
      "Cập nhật trạng thái giao hàng tại Green Feast",
      `Đơn hàng của bạn với mã đơn hàng <b>${data.orderId}</b> đã được cập nhật trạng thái giao hàng thành <b>${data.status}</b>. Mọi vấn đề phát sinh vui lòng liên hệ hotline: 0123456789.`
    )
  } catch (err) {
    console.error(`Error handleMailStatusOrder: ${err.message}`)
  }
}

module.exports = {
  receiveQueue,
  receiveQueueNotification,
  receiveQueueUser,
  receiveQueueStatusOrder,
}
