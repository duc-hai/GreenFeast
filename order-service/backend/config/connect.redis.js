const redis = require('redis')

async function connectRedis() {
    try {
        const client = await redis.createClient({
            // host: process.env.REDIS_HOST,
            // port: process.env.REDIS_PORT
            password: 'Uap9HV03MftaLfegkAdXKGsC9khtflQa',
            socket: {
                host: 'redis-12855.c325.us-east-1-4.ec2.redns.redis-cloud.com',
                port: 12855
            }
        })

        client.on('connect', () => {
            console.log('Connect to Redis successfully')
        })

        client.on('error', (err) => {
            console.error(`Error occured when connect to Redis: ${err}`)
        })

        await client.connect()

        return client
    }
    catch (err) {
        console.error(`Connect redis failed: ${err.message}`)
    }
}

module.exports = connectRedis
            