const mongoose = require('mongoose')
const clientRedis = require('redis').createClient({
    socket: {
        host: process.env.REDISDB_DATABASE_ENDPOINT, 
        port: process.env.REDISDB_DATABASE_PORT
    },
    password: process.env.REDISDB_DATABASE_PASSWORD
})

module.exports = {
    connectMongoDB: async () => {
        await mongoose.connect(`mongodb+srv://lefax_user:${process.env['MONGODB_SECRET']}@cluster0.ysx9t.mongodb.net/${process.env['MONGODB_DATABASE']}?retryWrites=true&w=majority`, err => {
            if (err) throw err
            console.log('Successfully connected to database.')
        })
    },
    connectRedisDB: async() => { 
        clientRedis.on('connect', () => console.log('Connected to redis server!'))
        clientRedis.on('error', (err) => console.error(err))
        await clientRedis.connect()
    },
    clientRedis: clientRedis,
    secretKey: process.env.JWT_SECRET,
    countryImagePath: './medias/images/countries/'
}