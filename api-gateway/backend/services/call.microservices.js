const axios = require('axios')
// const http = require('http')
// const URL = require('url')

class CallMicroservices {
    async forwardRequest (req, res, next) {
        try {
            //Need to format right res
            res.set({ 'content-type': 'application/json; charset=utf-8' })
            
            let headers = req.headers

            console.log(headers)

            if (req.user)
                //Pass user infor through header in order to handle essential data
                //The header will not accept cases with accents, so you need to use encodeURIComponent to encode special characters such as accent, dot, comma, ... into safe characters that can be transmitted through the header, the receiver only needs to use the decode function to get the original data
                headers['user-infor-header'] = encodeURIComponent(JSON.stringify(req.user))
            
            // console.log(headers)

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
}

module.exports = new CallMicroservices()