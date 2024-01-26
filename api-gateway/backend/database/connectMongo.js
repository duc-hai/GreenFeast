const mongoose = require('mongoose')

async function connect() {
    try {
        await mongoose.connect(process.env.CONNECTION_STRING, {
            dbName: process.env.DB_NAME
        })

        console.log(`Connect succesful to database ${process.env.DB_NAME}`)
    }
    catch (err) {
        console.error(`Connect database ${process.env.DB_NAME} error with message: ${err.message}`)
    }
}

module.exports = {
    connect
}