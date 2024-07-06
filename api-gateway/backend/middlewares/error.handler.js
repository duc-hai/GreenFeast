const logger = require('./logger.log')

const catchNotFoundError = (req, res) => {
    return res.status(404).json({status: 'error', message: 'Không tìm thấy đường dẫn'})
}

const errorHandle = (err, req, res, next) => {
    // console.log(err.stack) 
    
    logger.error(`${req.method} ${req.originalUrl} [status: ${err.status} - message: ${err.message}]`) //tracking log error
    
    return res.status(err.status).json({status: 'error', message: err.message})
}

module.exports = {
    catchNotFoundError,
    errorHandle
}