const logger = require('./logger.log')

const catchNotFoundError = (req, res) => {
    return res.status(404).json({status: 'error', message: 'Không tìm thấy đường dẫn'})
}

const errorHandle = (err, req, res, next) => {
    //Logger error
    if (err.stack) {
        logger.error(`${req.method} ${req.originalUrl} [status: 500 - message: ${err.stack}]`)
        return res.status(500).json({status: 'error', message: `Lỗi máy chủ: ${err.stack}`})
    }

    //Logger error
    logger.error(`${req.method} ${req.originalUrl} [status: ${err[0]} - message: ${err[2]}]`)

    return res.status(err[0]).json({status: err[1], message: err[2]})
}

module.exports = {
    catchNotFoundError,
    errorHandle
}