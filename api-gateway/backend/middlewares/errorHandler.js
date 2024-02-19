const catchNotFoundError = (req, res) => {
    return res.status(404).json({status: 'error', message: 'url not found'})
}

const errorHandle = (err, req, res, next) => {
    if (err.stack)
        return res.status(500).json({status: 'error', message: `Server error: ${err.stack}`})
    return res.status(err[0]).json({status: err[1], message: err[2]})
}

module.exports = {
    catchNotFoundError,
    errorHandle
}