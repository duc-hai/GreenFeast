const axios = require('axios')
const { PassThrough } = require('stream')
const logger = require('../middlewares/logger.log')
const StatusCode = require('../enums/http.status.code')
const createError = require('http-errors')
const envOfServivces = require('../config/env.services')

class RecommendService {
    sendRequestToService = async (req, res, next) => {
        try {
            const envServiceUrl = process.env[envOfServivces['recommend']]

            if (!envServiceUrl)
                return next(createError(StatusCode.InternalServerError_500, 'Không tìm thấy đường dẫn dịch vụ hợp lệ !')) 

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
                method: 'GET',
                url: `${envServiceUrl}${pathname}`,
                responseEncoding: 'utf8',
                validateStatus: function (status) {
                    return status >= 100 && status <= 600
                },
                headers: headers
            })

            const dataResponse = axiosResponse.data

            if (!dataResponse)
                return next(createError(StatusCode.BadRequest_400, `Đã xảy ra lỗi khi nhận dữ liệu trả về: ${dataResponse.message}`)) 

            const dataMenu = dataResponse?.data

            if (!dataMenu)
                return next(createError(dataResponse.status, dataResponse.message)) 

            const menuArray = JSON.parse(dataMenu)

            const dataResult = await Promise.all(menuArray.map(async value => {
                const axiosData = await axios({
                    method: 'GET',
                    url: `${process.env[envOfServivces['order']]}/order/menu/${value}`,
                    responseEncoding: 'utf8',
                    validateStatus: function (status) {
                        return status >= 100 && status <= 600
                    },
                })
                
                return axiosData.data?.data || {}
            }))

            return res.status(axiosResponse.status).json({
                status: dataResponse.status,
                message: dataResponse.message,
                data: dataResult
            })
        }
        catch (err) {
            return next(createError(StatusCode.InternalServerError_500, err.message)) 
        }
    }
}

module.exports = new RecommendService()