const StatusCodeEnum = require('../enums/http.status.code')
const nodemailer = require('nodemailer')
require('dotenv').config()

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
}   

module.exports = new EmailService()