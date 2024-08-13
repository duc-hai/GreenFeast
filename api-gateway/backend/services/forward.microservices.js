const axios = require('axios')
const { PassThrough } = require('stream')
const logger = require('../middlewares/logger.log')
const StatusCode = require('../enums/http.status.code')
const createError = require('http-errors')
const envOfServivces = require('../config/env.services')
// const http = require('http')
// const URL = require('url')

class CallMicroservices {
    forwardRequestWithAlias = (alias) => {
        return this.forwardRequest.bind(this, alias)
    }

    forwardRequest = async (alias, req, res, next) => {
        try {
            const envServiceUrl = process.env[envOfServivces[alias]]

            if (!envServiceUrl) return next(createError(StatusCode.InternalServerError_500, 'Không tìm thấy đường dẫn dịch vụ hợp lệ !')) 

            //Need to format right res
            res.set({ 'content-type': 'application/json; charset=utf-8' })
            
            let headers = req.headers

            //Axios will automatically calculate and set the values for these fields, so to ensure accuracy, let Axios set it itself instead of getting the client's headers
            //If not having delete these parameters could lead to unexpected errors, request will be timeout
            delete headers?.host
            delete headers['content-length']
            delete headers['user-agent']
            delete headers?.accept

            if (req.user)
                //Pass user infor through header in order to handle essential data
                //The header will not accept cases with accents, so you need to use encodeURIComponent to encode special characters such as accent, dot, comma, ... into safe characters that can be transmitted through the header, the receiver only needs to use the decode function to get the original data
                headers['user-infor-header'] = encodeURIComponent(JSON.stringify(req.user))

            //Example: /menu/get-all (Do not have query string)
            const pathname = req?._parsedUrl?.pathname

            if (!pathname)
                return next(createError(StatusCode.BadRequest_400, 'Đã xảy ra lỗi đường dẫn')) 

            const axiosResponse = await axios({
                method: req.method.toLowerCase(),
                url: `${envServiceUrl}${pathname}`,
                responseType: 'stream',
                responseEncoding: 'utf8',
                validateStatus: function (status) {
                    return status >= 100 && status <= 600
                },
                params: req.query,
                data: req.body,
                headers: headers
            })

            const passThroughStream = this.forwardResponseToClient(req, axiosResponse)

            return passThroughStream.pipe(res)
            
            // return axiosResponse.data.pipe(res)

            //Another way is use http built in module in NodeJS
            // const opts = Object.assign({}, URL.parse('http://localhost:4000'), {
            //     path: `/menu/get-all`,
            //     method: req.method
            // })

            // http.request(opts, (x) => { x.pipe(res); }).end()    
        }
        catch (err) {
            return next(createError(StatusCode.InternalServerError_500, err.message)) 
        }
    }

    forwardResponseToClient = (req, axiosResponse) => {
        const passThroughStream = new PassThrough() //Storage data

        axiosResponse.data.pipe(passThroughStream) //Put data from axios res to passthrough
            
        let responseData = ''

        // Read data from res (IncomingMessage)
        axiosResponse.data.on('data', (chunk) => {
            responseData += chunk
        })

        // Res end, handle data
        axiosResponse.data.on('end', () => {
            responseData = JSON.parse(responseData)

            if (responseData.status === 'error') {
                let bodyInfor = ''
                let userId = ''
                if (req.user) userId = ` - userid: ${req.user._id}`
                if (req.body && Object.keys(req.body).length !== 0) bodyInfor = ` - body: ${JSON.stringify(req.body)}`
                logger.loggerError.error(`${req.method} ${req.originalUrl} [status: 500 - message: ${responseData.message}]${bodyInfor}${userId}`)
            }
        })

        return passThroughStream        
    }

    forwardRequestAliasUploadFile = (alias) => {
        return this.forwardRequestUploadFile.bind(this, alias)
    }

    forwardRequestUploadFile = async (alias, req, res, next) => {
        try {
            const envServiceUrl = process.env[envOfServivces[alias]]

            if (!envServiceUrl)
                return next(createError(StatusCode.InternalServerError_500, 'Không tìm thấy đường dẫn dịch vụ hợp lệ !')) 

            const formData = this.setFormData(req)

            res.set({ 'content-type': 'application/json; charset=utf-8' })
            
            let headers = req.headers

            delete headers?.host
            delete headers['content-length']
            delete headers['user-agent']
            delete headers?.accept

            if (req.user)
                headers['user-infor-header'] = encodeURIComponent(JSON.stringify(req.user))

            //Example: /menu/get-all (Do not have query string)
            const pathname = req?._parsedUrl?.pathname

            if (!pathname)
                return next([400, 'error', 'Đã xảy ra lỗi đường dẫn'])

            const axiosResponse = await axios({
                method: req.method.toLowerCase(),
                url: `${envServiceUrl}${pathname}`,
                responseType: 'stream',
                responseEncoding: 'utf8',
                validateStatus: function (status) {
                    return status >= 100 && status <= 600
                },
                params: req.query,
                data: formData,
                headers: headers
            })

            const passThroughStream = this.forwardResponseToClient(req, axiosResponse)

            return passThroughStream.pipe(res)
        }
        catch (err) {
            return next(createError(StatusCode.InternalServerError_500, err.message)) 
        }
    }

    setFormData = (req) => {
        const file = req.file

        const formData = new FormData()
            
        if (file) {
            //Add file to form data, we need to add blob format
            formData.append('image', (new Blob([file.buffer], { type: file.mimetype })), {
                filename: file.originalname,
                contentType: file.mimetype,
            })
        }

        Object.keys(req.body).forEach(key => {
            formData.append(key, req.body[key])
        })

        return formData
    }

    simulateReceiveNewOrderTms = (req, res, next) => {
        return res.status(200).json({
            statusCode: 200,
            message: 'The shipping unit has received the order',
        })
    }
}

module.exports = new CallMicroservices()