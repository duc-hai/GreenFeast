const StatusCodeEnum = require('../enums/http.status.code')
const nodemailer = require('nodemailer')
require('dotenv').config()
const ejs = require('ejs')
const path = require('path')

class EmailService {
    sendMail = async (toEmail, subject, text) => {
        try {
            const transporter = this.createTransporter()

            var mailOptions = {
                from: process.env.EMAIL_USERNAME,
                to: toEmail,
                subject: subject,
                // text: text,
                html: text
            }

            const info = await transporter.sendMail(mailOptions)
            // console.log(info)
        }
        catch (error) {
            console.log(`Error occured at createTransporter: ${error.message}`)
        }
    }

    sendMailPromotion = async (toEmail, subject, text) => {
        try {
            const transporter = this.createTransporter()
            const viewPath = path.join(__dirname, '../views')
            const viewEjs = path.join(viewPath, 'promotion.ejs')
            const emailContent = await this.renderFile(viewEjs, {
                discountDetails: text
            })
            var mailOptions = {
                from: process.env.EMAIL_USERNAME,
                bcc: toEmail,
                subject: subject,
                // text: text,
                html: emailContent,
                attachments: [{
                    filename: 'banner.jpg',
                    path: path.join(viewPath, 'banner-1.jpg'),
                    cid: 'unique@nodemailer.com' //same cid value as in the html img src
                }]
            }

            const info = await transporter.sendMail(mailOptions)
            // console.log(info)
        }
        catch (error) {
            console.log(`Error occured at sendMailPromotion: ${error.message}`)
        }
    }

    createTransporter = () => {
        try {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  user: process.env.EMAIL_USERNAME,
                  pass: process.env.EMAIL_PASSWORD
                }
            })
            return transporter
        }
        catch (error) {
            console.log(`Error occured at createTransporter: ${error.message}`)
        }
    }

    renderFile = (filePath, data) => {
        return new Promise((resolve, reject) => {
          ejs.renderFile(filePath, data, (err, str) => {
            if (err) {
              reject(err)
            } else {
              resolve(str)
            }
          })
        })
    }
}   

module.exports = new EmailService()