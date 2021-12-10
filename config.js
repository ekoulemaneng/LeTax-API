const mongoose = require('mongoose')

module.exports = {
    connectDB: async () => {
        await mongoose.connect(`mongodb+srv://lefax_user:${process.env['MONGODB_SECRET']}@cluster0.ysx9t.mongodb.net/${process.env['DATABASE']}?retryWrites=true&w=majority`, err => {
            if (err) throw err
            console.log('Successfully connected to database.')
        })
    },
    secretKey: process.env.JWT_SECRET,
    countryImagePath: './medias/images/countries/'
}