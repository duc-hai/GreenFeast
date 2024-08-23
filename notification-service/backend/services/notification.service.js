const StatusCodeEnum = require("../enums/http.status.code")
const Notification = require("../models/notification")
const User = require("../models/user")
const socketIoService = require("./socketio.service")

class NotificationService {
  getNumberOfNoti = async (req, res, next) => {
    try {
      // console.log(req.headers['user-infor-header'])
      const userInfor = JSON.parse(
        decodeURIComponent(req.headers["user-infor-header"])
      )
      // console.log(userInfor)
      const numberOfNoti = await Notification.countDocuments({
        userId: userInfor._id,
        isRead: false,
      })
      return res.status(StatusCodeEnum.OK_200).json({
        status: "success",
        messsage: "Lấy số lượng thông báo mới thành công",
        data: numberOfNoti,
      })
    } catch (err) {
      return next([
        StatusCodeEnum.InternalServerError_500,
        "error",
        `Error is occured at getNumberOfNoti: ${err.message}`,
      ])
    }
  }

  getNotifications = async (req, res, next) => {
    try {
      // console.log(req.headers['user-infor-header'])
      const userInfor = JSON.parse(
        decodeURIComponent(req.headers["user-infor-header"])
      )
      // console.log(userInfor)
      const notifications = await Notification.find({
        userId: userInfor._id,
      })
        .sort({ isRead: 1, createdAt: -1, updatedAt: -1 })
        .limit(20)

      //asynchorously isn't wokring here :((
      await Notification.updateMany(
        { userId: userInfor._id },
        { $set: { isRead: true } }
      )

      return res.status(StatusCodeEnum.OK_200).json({
        status: "success",
        messsage: "Lấy danh sách thông báo thành công",
        data: notifications,
      })
    } catch (err) {
      return next([
        StatusCodeEnum.InternalServerError_500,
        "error",
        `Error is occured at getNotifications: ${err.message}`,
      ])
    }
  }

  storageDatabaseNotification = async (data) => {
    try {
      data = JSON.parse(data)
      if (!data) {
        console.error(`Data from message queue is not exist, error occured`)
        return null
      }

      if (!data.broadcast) {
        new Notification({
          userId: data.userId,
          title: data.title,
          message: data.message,
          link: data.link,
        }).save()

        socketIoService.sendNotification(data.title, data.message, data.userId)
      } 
      else {
        const user = await User.find({ user_type: data.broadcast })
        if (!user) return
        // console.log("listUser :", user)
        user.forEach((value) => {
          new Notification({
            userId: value._id,
            title: data.title,
            message: data.message,
            link: data.link,
          }).save()
          socketIoService.sendNotification(data.title, data.message, value._id)
        })
      }
    } catch (err) {
      console.error(
        `Error occurred at storageDatabaseNotification: ${err.message}`
      )
    }
  }
}

module.exports = new NotificationService()
