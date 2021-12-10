const mongoose = require('mongoose')
const { Schema } = mongoose

const trackSchema = Schema({
    name: { type: String, trim: true, required: true },
    category: { type: String, enum: ['Exam', 'Contest'], required: true },
    diploma: String,
    school: String,
    country: { type: Schema.Types.ObjectId, ref: 'Country' },
    description: String
})

module.exports = mongoose.model('Track', trackSchema)