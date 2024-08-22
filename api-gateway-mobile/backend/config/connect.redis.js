require('dotenv').config()

const redis = require('redis')

async function connectRedis() {
    try {
        const client = await redis.createClient({
            // host: process.env.REDIS_HOST,
            // port: process.env.REDIS_PORT
            password: 'jsn0E8ZxYvzY1uP0eEs8vqYy4QnnIqEz',
            socket: {
                host: 'redis-14703.c12.us-east-1-4.ec2.redns.redis-cloud.com',
                port: 14703
            }
        })

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
            