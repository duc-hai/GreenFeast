const redis = require('redis')

async function connectRedis() {
    try {
        const client = await redis.createClient()

        client.on('connect', () => {
            console.log('Connect to Redis successfully')
        })

        client.on('error', (err) => {
            console.error(`Error occured when connect to Redis: ${err}`)
            throw new Error(`Error occured when connect to Redis: ${err}`)
        })

        await client.connect()

        return client
    }
    catch (err) {
        console.error(`Connect redis failed: ${err.message}`)
    }
}

module.exports = connectRedis
            