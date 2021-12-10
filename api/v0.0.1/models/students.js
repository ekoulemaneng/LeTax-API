const mongoose = require('mongoose')
const { Schema } = mongoose
const jwt = require('jsonwebtoken')
const { secretKey } = require('../../../config')

const trackSchema = Schema({
    id: String,
    name: String,
    category: String,
    diploma: String,
    school: String,
    country: { id: String, name: String },
    description: String
})

const studentSchema = Schema({
    name: {type: String, trim: true, required: true},
    email: {type: String, trim: true, required: true},
    password: {type: String, required: true},
    role: {type: String, default: 'student', required: true },
    tracks: [trackSchema]
})

studentSchema.methods.createToken = async function() {
    try {
        const payload = {
            name: this.name,
            email: this.email,
            role: this.role
        }
        return await jwt.sign(payload, secretKey)
    } 
    catch (error) {
        console.error(error)
    }
}

module.exports = mongoose.model('Student', studentSchema)