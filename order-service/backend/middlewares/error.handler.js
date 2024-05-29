const catchNotFoundError = (req, res) => {
    return res.status(404).json({status: 'error', message: 'Không tìm thấy đường dẫn'})
}

const errorHandle = (err, req, res, next) => {
    if (err.stack)
        return res.status(500).json({status: 'error', message: `Lỗi máy chủ: ${err.stack}`})
    return res.status(err.status).json({status: 'error', message: err.message})
}

module.exports = {
    catchNotFoundError,
    errorHandle
}