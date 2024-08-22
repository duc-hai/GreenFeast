const logger = require('./logger.log')

const catchNotFoundError = (req, res) => {
    return res.status(404).json({status: 'error', message: 'Không tìm thấy đường dẫn'})
}

const errorHandle = (err, req, res, next) => {
    // console.log(err.stack) 
    let bodyInfor = ''
    let userId = ''
    if (req.body && Object.keys(req.body).length !== 0) bodyInfor = ` - body: ${JSON.stringify(req.body)}`
    if (req.user) userId = ` - userid: ${req.user._id}`
    logger.loggerError.error(`${req.method} ${req.originalUrl} [status: ${err.status} - message: ${err.message}]${bodyInfor}${userId}`) //tracking log error
    
    return res.status(err.status).json({status: 'error', message: err.message})
}

module.exports = {
    catchNotFoundError,
    errorHandle
}