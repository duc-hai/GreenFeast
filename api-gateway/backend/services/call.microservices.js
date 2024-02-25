const axios = require('axios')
// const http = require('http')
// const URL = require('url')

class CallMicroservices {
    async forwardRequest (req, res, next) {
        try {
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
                return next([400, 'error', 'Đã xảy ra lỗi đường dẫn'])
           
            const axiosResponse = await axios({
                method: req.method.toLowerCase(),
                url: `${process.env.MANAGEMENT_SERVICE_URL}${pathname}`,
                responseType: 'stream',
                responseEncoding: 'utf8',
                validateStatus: function (status) {
                    return status >= 100 && status <= 600
                },
                params: req.query,
                data: req.body,
                headers: headers
            })
            
            // console.log(axiosResponse)

            return axiosResponse.data.pipe(res)

            //Another way is use http built in module in NodeJS
            // const opts = Object.assign({}, URL.parse('http://localhost:4000'), {
            //     path: `/menu/get-all`,
            //     method: req.method
            // })

            // http.request(opts, (x) => { x.pipe(res); }).end()
        }
        catch (err) {
            return next([400, 'error', err.message])
        }
    }

    async forwardRequestUploadFile (req, res, next) {
        try {
            const file = req.file

            const formData = new FormData()
            //Add file to form data, we need to add blob format
            formData.append('image', (new Blob([file.buffer], { type: file.mimetype })), {
                filename: file.originalname,
                contentType: file.mimetype,
            })

            Object.keys(req.body).forEach(key => {
                formData.append(key, req.body[key])
            })

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
                url: `${process.env.MANAGEMENT_SERVICE_URL}${pathname}`,
                responseType: 'stream',
                responseEncoding: 'utf8',
                validateStatus: function (status) {
                    return status >= 100 && status <= 600
                },
                params: req.query,
                data: formData,
                headers: headers
            })

            return axiosResponse.data.pipe(res)
        }
        catch (err) {
            return next([400, 'error', err.message])
        }
    }
}

module.exports = new CallMicroservices()