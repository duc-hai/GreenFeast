const mongoose = require('mongoose')

async function connect() {
    const connectionString = 'mongodb://' + process.env.DB_HOST + ':' + process.env.DB_PORT
    try {
        await mongoose.connect(connectionString, {
            dbName: process.env.DB_NAME
        })

        console.log(`Connect succesful to database ${process.env.DB_NAME}`)
    }
    catch (err) {
        console.error(`Connect database ${process.env.DB_NAME} error with message: ${err.message}. Connection string is: ${connectionString}`)
    }
}

module.exports = {
    connect
}