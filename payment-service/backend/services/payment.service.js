const querystring = require('qs')
const crypto = require('crypto') 
const moment = require('moment') ////moment is a widely used JavaScript library for handling and displaying dates and times, more customizable than Date
const sortObject = require('../helpers/sortObject.helper')
const ResponseCodeVNPay = require('../enums/response.code.vnpay')
const Transfer = require('../models/transfer')
const mongoose = require('mongoose')
const producer = require('../services/producer.service')
const axios = require('axios')
const ResponseQueryVNPay =  require('../enums/response.query.payment')
const ResponseReturnVNPay = require('../enums/response.return.vnpay')
const Refund = require('../models/refund')

class PaymentService {
    createPaymentUrl = (req, res, next) => {
        try {
            let { amount, orderId } = req.body 

            if (!amount || !orderId)
                return next([500, 'error', 'Thiếu thông tin thanh toán'])

            orderId = orderId + '-' + Date.now()

            // const bankCode = req.body || 'VNBANK' 
            //Payment method code, bank type code or payment e-wallet. If not sent to this parameter, redirect users to VNPAY to choose payment method.
            /*
                vnp_BankCode=VNPAYQRThanh toán quét mã QR
                vnp_BankCode=VNBANKThẻ ATM - Tài khoản ngân hàng nội địa
                vnp_BankCode=INTCARDThẻ thanh toán quốc tế
            */

            let locale = req.body.language
            if(!locale) locale = 'vn'
            
            process.env.TZ = 'Asia/Ho_Chi_Minh' //The EZ environment variable is used to set the time zone for the website, it will help time functions, objects like 'date' become more accurate
    
            const date = new Date()
            const createDate = moment(date).format('YYYYMMDDHHmmss') //time to create transaction 

            //Get ip address from header's client, ensure that it can get ip address even if app deployed with a proxy or load balancer 
            const ipAddr = req.headers['x-forwarded-for'] ||
                req.connection.remoteAddress ||
                req.socket.remoteAddress ||
                req.connection.socket.remoteAddress
            
            const tmnCode = process.env.vnp_TmnCode //identifier code provided by VNPay
            const secretKey = process.env.vnp_HashSecret // Secret string used to check data integrity when two systems exchange information (checksum)
            let vnpUrl = process.env.vnp_Url // url to redirect to payment service of VN Pay
            const returnUrl = process.env.vnp_ReturnUrl // url will callback to return payment result

            /*
                URL format: https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=1806000&vnp_Command=pay&vnp_CreateDate=20210801153333&vnp_CurrCode=VND&vnp_IpAddr=127.0.0.1&vnp_Locale=vn&vnp_OrderInfo=Thanh+toan+don+hang+%3A5&vnp_OrderType=other&vnp_ReturnUrl=https%3A%2F%2Fdomainmerchant.vn%2FReturnUrl&vnp_TmnCode=DEMOV210&vnp_TxnRef=5&vnp_Version=2.1.0&vnp_SecureHash=3e0d61a0c0534b2e36680b3f7277743e8784cc4e1d68fa7d276e79c23be7d6318d338b477910a27992f5057bb1582bd44bd82ae8009ffaf6d141219218625c42

                Document of VNPay: https://sandbox.vnpayment.vn/apis/docs/thanh-toan-pay/pay.html
            */

            let currCode = 'VND'
            let vnp_Params = {}
            
            vnp_Params['vnp_Version'] = '2.1.0' //The api version that the merchant connects to. Current version is: 2.1.0
            vnp_Params['vnp_Command'] = 'pay' //Api code, payment transaction is pay
            vnp_Params['vnp_TmnCode'] = tmnCode //Explained above
            vnp_Params['vnp_Locale'] = locale //language of interface, vn or en
            vnp_Params['vnp_CurrCode'] = currCode //Currency used for payment. Currently only supports VND
            vnp_Params['vnp_TxnRef'] = orderId //Reference code of the transaction in the merchant's system. This code is unique to distinguish orders sent to VNPAY. There should be no overlap in days
            vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho ma GD:' + orderId
            vnp_Params['vnp_OrderType'] = 'other' //Product category code. Each good will belong to a group of categories specified by VNPAY
            vnp_Params['vnp_Amount'] = amount * 100 //Payment amount. The amount does not contain decimal separators, thousandths, or currency characters. To send the payment amount of 10,000 VND (ten thousand VND), the merchant needs to multiply it by 100 times (remove the decimal part), then send to VNPAY as: 1000000
            vnp_Params['vnp_ReturnUrl'] = returnUrl //explained above
            vnp_Params['vnp_IpAddr'] = ipAddr //ip address of client 
            vnp_Params['vnp_CreateDate'] = createDate //time to create transaction
            // if(bankCode !== null && bankCode !== ''){
            //     vnp_Params['vnp_BankCode'] = bankCode
            // }

            vnp_Params = sortObject(vnp_Params)

            const signData = querystring.stringify(vnp_Params, { encode: false })
            
            //vnp_SecureHash: Checksum code to ensure the transaction data is not changed during the transfer from merchant to VNPAY. The generation of this code depends on the merchant's configuration and the api version used. Current version supports SHA256, HMACSHA512.
            const hmac = crypto.createHmac("sha512", secretKey)
            const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex") 
            vnp_Params['vnp_SecureHash'] = signed

            //Assign all of params (querystring) into url
            vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false })

            // res.redirect(vnpUrl)
            return res.status(200).json({
                status: 'success',
                data: {
                    vnpUrl
                }
            })
        }
        catch (err) {
            return next([500, 'error', `Error is occured at createPaymentUrl: ${err.message}`])
        }
    }

    vnpayReturn = async (req, res, next) => {
        try {
            /*
                URL format (redirect from VNPay server): 
                https://{domain}/ReturnUrl?vnp_Amount=1000000&vnp_BankCode=NCB&vnp_BankTranNo=VNP14226112&vnp_CardType=ATM&vnp_OrderInfo=Thanh+toan+don+hang+thoi+gian%3A+2023-12-07+17%3A00%3A44&vnp_PayDate=20231207170112&vnp_ResponseCode=00&vnp_TmnCode=CTTVNP01&vnp_TransactionNo=14226112&vnp_TransactionStatus=00&vnp_TxnRef=166117&vnp_SecureHash=b6dababca5e07a2d8e32fdd3cf05c29cb426c721ae18e9589f7ad0e2db4b657c6e0e5cc8e271cf745162bcb100fdf2f64520554a6f5275bc4c5b5b3e57dc4b4b
            */
            let vnp_Params = req.query

            let secureHash = vnp_Params['vnp_SecureHash']

            delete vnp_Params['vnp_SecureHash']
            delete vnp_Params['vnp_SecureHashType']

            vnp_Params = sortObject(vnp_Params)

            let tmnCode = process.env.vnp_TmnCode
            let secretKey = process.env.vnp_HashSecret

            let signData = querystring.stringify(vnp_Params, { encode: false })
            let hmac = crypto.createHmac('sha512', secretKey)
            let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex')     

            if(secureHash !== signed)
                res.status(500).json({
                    status: 'error',
                    message: 'Đã xảy ra lỗi với giao dịch'
                })

            const resultSaveDatabase = await this.saveToDatabase(vnp_Params)

            if (!resultSaveDatabase)
                return res.status(500).json({ status: 'error', message: 'Đã xảy ra lỗi khi lưu giao dịch vào cơ sở dữ liệu' })

            if (vnp_Params['vnp_TransactionStatus'] == '00' && vnp_Params['vnp_ResponseCode'] == '00')
                return res.status(200).json({
                    status: 'success',
                    code: vnp_Params['vnp_ResponseCode'],
                    message: 'Giao dịch thành công'
                })
            
            return res.status(500).json({  
                status: 'error',
                code: vnp_Params['vnp_ResponseCode'],
                message: ResponseCodeVNPay[vnp_Params['vnp_ResponseCode']]
            })
        }
        catch (err) {
            return next([500, 'error', `Error is occured at vnpayReturn: ${err.message}`])
        }
    }

    queryHistoryPayment = async (req, res, next) => {
        try {
            /*
                {
                    "orderId": "66b4ba0ceb3105e70019a835-1723120141181",
                    "transDate": "20240808192934"
                }
            */
            process.env.TZ = 'Asia/Ho_Chi_Minh'
            let date = new Date()
            let vnp_TmnCode = process.env.vnp_TmnCode
            let secretKey = process.env.vnp_HashSecret
            let vnp_Api = process.env.vnp_Api
            
            let vnp_TxnRef = req.body.orderId
            let vnp_TransactionDate = req.body.transDate
            
            let vnp_RequestId =moment(date).format('HHmmss')
            let vnp_Version = '2.1.0'
            let vnp_Command = 'querydr'
            let vnp_OrderInfo = 'Truy van GD ma:' + vnp_TxnRef
            
            let vnp_IpAddr = req.headers['x-forwarded-for'] ||
                req.connection.remoteAddress ||
                req.socket.remoteAddress ||
                req.connection.socket.remoteAddress
        
            let currCode = 'VND'
            let vnp_CreateDate = moment(date).format('YYYYMMDDHHmmss')
            
            let data = vnp_RequestId + "|" + vnp_Version + "|" + vnp_Command + "|" + vnp_TmnCode + "|" + vnp_TxnRef + "|" + vnp_TransactionDate + "|" + vnp_CreateDate + "|" + vnp_IpAddr + "|" + vnp_OrderInfo
            
            let hmac = crypto.createHmac("sha512", secretKey)
            let vnp_SecureHash = hmac.update(Buffer.from(data, 'utf-8')).digest("hex") 
            
            let dataObj = {
                'vnp_RequestId': vnp_RequestId,
                'vnp_Version': vnp_Version,
                'vnp_Command': vnp_Command,
                'vnp_TmnCode': vnp_TmnCode,
                'vnp_TxnRef': vnp_TxnRef,
                'vnp_OrderInfo': vnp_OrderInfo,
                'vnp_TransactionDate': vnp_TransactionDate,
                'vnp_CreateDate': vnp_CreateDate,
                'vnp_IpAddr': vnp_IpAddr,
                'vnp_SecureHash': vnp_SecureHash
            }
            // /merchant_webapi/api/transaction
            const response = await axios.post(vnp_Api, dataObj)
            return res.status(200).json({
                status: 'success',
                message: ResponseQueryVNPay[response.data.vnp_ResponseCode || '99'],
                data: response.data
            })
        }
        catch (err) {
            return next([500, 'error', `Error is occured at queryHistoryPayment: ${err.message}`])
        }
    }

    returnPayment = async (req, res, next) => {
        try {
            process.env.TZ = 'Asia/Ho_Chi_Minh'
            let date = new Date()
           
            let vnp_TmnCode = process.env.vnp_TmnCode
            let secretKey = process.env.vnp_HashSecret
            let vnp_Api = process.env.vnp_Api
            
            let vnp_TxnRef = req.body.orderId
            let vnp_TransactionDate = req.body.transDate
            let vnp_Amount = req.body.amount * 100
            let vnp_TransactionType = req.body.transType

            const userId = JSON.parse(decodeURIComponent(req.headers['user-infor-header']))?._id
            let vnp_CreateBy = userId || 'undefined' //req.body.user
                    
            let currCode = 'VND'
            
            let vnp_RequestId = moment(date).format('HHmmss')
            let vnp_Version = '2.1.0'
            let vnp_Command = 'refund'
            let vnp_OrderInfo = 'Hoan tien GD ma:' + vnp_TxnRef
                    
            let vnp_IpAddr = req.headers['x-forwarded-for'] ||
                req.connection.remoteAddress ||
                req.socket.remoteAddress ||
                req.connection.socket.remoteAddress
            
            let vnp_CreateDate = moment(date).format('YYYYMMDDHHmmss')
            
            let vnp_TransactionNo = '0'
            
            let data = vnp_RequestId + "|" + vnp_Version + "|" + vnp_Command + "|" + vnp_TmnCode + "|" + vnp_TransactionType + "|" + vnp_TxnRef + "|" + vnp_Amount + "|" + vnp_TransactionNo + "|" + vnp_TransactionDate + "|" + vnp_CreateBy + "|" + vnp_CreateDate + "|" + vnp_IpAddr + "|" + vnp_OrderInfo
            let hmac = crypto.createHmac("sha512", secretKey)
            let vnp_SecureHash = hmac.update(Buffer.from(data, 'utf-8')).digest("hex")
            
             let dataObj = {
                'vnp_RequestId': vnp_RequestId,
                'vnp_Version': vnp_Version,
                'vnp_Command': vnp_Command,
                'vnp_TmnCode': vnp_TmnCode,
                'vnp_TransactionType': vnp_TransactionType,
                'vnp_TxnRef': vnp_TxnRef,
                'vnp_Amount': vnp_Amount,
                'vnp_TransactionNo': vnp_TransactionNo,
                'vnp_CreateBy': vnp_CreateBy,
                'vnp_OrderInfo': vnp_OrderInfo,
                'vnp_TransactionDate': vnp_TransactionDate,
                'vnp_CreateDate': vnp_CreateDate,
                'vnp_IpAddr': vnp_IpAddr,
                'vnp_SecureHash': vnp_SecureHash
            }
            
            const response = await axios.post(vnp_Api, dataObj)

            if (response.data) this.storageReturnDatabase(response.data, userId)
            
            return res.status(200).json({
                status: 'success',
                message: ResponseReturnVNPay[response.data.vnp_ResponseCode || '99'],
                data: response.data
            })
        }
        catch (err) {
            return next([500, 'error', `Error is occured at returnPayment: ${err.message}`])
        }
    }

    storageReturnDatabase = async (data, userId) => {
        try {
            await new Refund({
                _id: data.vnp_ResponseId,
                response_code: `${data.vnp_ResponseCode}: ${ResponseReturnVNPay[data.vnp_ResponseCode || '99']}`,
                response_message: data.vnp_Message,
                tmn_code: data.vnp_TmnCode,
                txn_ref: data.vnp_TxnRef,
                amount: data.vnp_Amount,
                content: data.vnp_OrderInfo,
                bank_code: data.vnp_BankCode,
                user_id: userId || ''
            }).save()
        }
        catch (err) {
            console.error(`Error at storageReturnDatabase: ${err.message}`)
            return null
        }
    }

    saveToDatabase = async query => {
        try {
            //https://{domain}/ReturnUrl?vnp_Amount=1000000&vnp_BankCode=NCB&vnp_BankTranNo=VNP14226112&vnp_CardType=ATM&vnp_OrderInfo=Thanh+toan+don+hang+thoi+gian%3A+2023-12-07+17%3A00%3A44&vnp_PayDate=20231207170112&vnp_ResponseCode=00&vnp_TmnCode=CTTVNP01&vnp_TransactionNo=14226112&vnp_TransactionStatus=00&vnp_TxnRef=166117&vnp_SecureHash=b6dababca5e07a2d8e32fdd3cf05c29cb426c721ae18e9589f7ad0e2db4b657c6e0e5cc8e271cf745162bcb100fdf2f64520554a6f5275bc4c5b5b3e57dc4b4b
            
            const orderId = query.vnp_TxnRef.split('-')[0]

            if (!mongoose.isValidObjectId(orderId)) return false

            await new Transfer({
                _id: query.vnp_TransactionNo,
                amount: query.vnp_Amount,
                bank_code: query.vnp_BankCode,
                bank_transaction_number: query.vnp_BankTranNo,
                card_type: query.vnp_CardType,
                order_id: orderId,
                order_infor: query.vnp_OrderInfo,
                response_code: query.vnp_ResponseCode,
                pay_time: query.vnp_PayDate,
                txn_ref: query.vnp_TxnRef
            }).save()

            producer.sendQueue({
                data: {
                    orderId: orderId,
                    amount: query.vnp_Amount,
                    note: query.vnp_OrderInfo
                },
                title: 'payment'
            })
            
            return true
        }
        catch (err) {
            console.error(err.message)
            return false
        }
    }
}

module.exports = new PaymentService()