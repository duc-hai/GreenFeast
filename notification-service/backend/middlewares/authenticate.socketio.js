const jwt = require('jsonwebtoken')

async function authenticateSocketIo (socket, next) {
    try {
        const token = socket.handshake.auth.token 
        if (!token || token == 'undefined') return next(new Error('Authentication error'))
        const verified = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY || '')
        if (!verified) return next(new Error('Authentication error'))
        socket.user = verified.username
        next()
    }
    catch (error) {
        console.error(`Error at authenticateSocketIo: ${error.message}`)
        return next(new Error('Authentication error'))
    }
}

module.exports = {
    authenticateSocketIo
}