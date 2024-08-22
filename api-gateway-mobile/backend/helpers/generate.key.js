const crypto = require('crypto')  

/* Use for random secret key for accesstoken, refreshtoken, cookie, session secret, ... */

// const key1 = crypto.randomBytes(32).toString('hex')
// const key2 = crypto.randomBytes(32).toString('hex') 
// console.table({ key1, key2 })

//Export module to used for random key such as salt,...
module.exports = (byteNumber) => {
    return crypto.randomBytes(byteNumber).toString('hex')
}