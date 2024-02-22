//The login method of the customer and the admin is the same, only the account type parameter in the database is different, so there needs to be a middleware to store the account_type before passing it to the next middleware to process the login.
function assignAccountType (accountType) {
    return async (req, res, next) => {
        try {
            if (typeof (accountType) === 'string')
                accountType = parseInt(accountType)
            req.locals = { accountType }
            return next()
        }
        catch (err) {
            return next([400, 'error', err.message])
        }
    }
}

module.exports = {
    assignAccountType
}