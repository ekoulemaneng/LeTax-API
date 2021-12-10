const mongoose = require('mongoose')
const { Schema } = mongoose
const jwt = require('jsonwebtoken')
const { secretKey } = require('../../../config')

const adminSchema = Schema({
    name: { type: String, trim: true, required: true },
    email: { type: String, trim: true, required: true },
    password: { type: String, required: true },
    role: { type: String, default: 'admin', required: true }
})

adminSchema.methods.createToken = async function() {
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

module.exports = mongoose.model('Admin', adminSchema)