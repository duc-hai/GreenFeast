const catchNotFoundError = (req, res) => {
    return res.status(404).json({status: 'error', message: 'Không tìm thấy đường dẫn'})
}

const errorHandler = (err, req, res, next) => {
    if (err.stack)
        return res.status(500).json({status: 'error', message: `Lỗi máy chủ: ${err.stack}`})
    return res.status(err[0]).json({status: err[1], message: err[2]})
}

module.exports = {
    catchNotFoundError,
    errorHandler
}