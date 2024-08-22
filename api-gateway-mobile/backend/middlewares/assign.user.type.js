const createError = require('http-errors')
//The login method of the customer and the admin is the same, only the user type parameter in the database is different, so there needs to be a middleware to store the user type before passing it to the next middleware to process the login.
function assignUserType (userType) {
    return async (req, res, next) => {
        try {
            if (typeof (userType) === 'string')
                userType = parseInt(userType)
            req.locals = { userType }
            return next()
        }
        catch (err) {
            return next(createError(500, err.message))
        }
    }
}

module.exports = {
    assignUserType
}