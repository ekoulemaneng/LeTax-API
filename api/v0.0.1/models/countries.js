const mongoose = require('mongoose')
const { Schema } = mongoose

const countrySchema = Schema({
    name: { type: String, trim: true, set: capitalize, required: true },
    code: { type: String, trim: true, set: v => v.toUpperCase(), required: true },
    image: String
})

function capitalize(name) {
    const lower = name.toLowerCase()
    return name.charAt(0).toUpperCase() + lower.slice(1)
}

module.exports = mongoose.model('Country', countrySchema)