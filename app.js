const express = require('express')
const app = express()

const { connectDB } = require('./config')
connectDB()

const cors = require('cors')
app.use(cors())

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

const swaggerUI = require('swagger-ui-express')
const YAML = require('yamljs')

const apiDocument_v001 = YAML.load('./api/docs/lefax.v0.0.1-openapi.yml')
app.use('/api/v0.0.1/docs', swaggerUI.serve, swaggerUI.setup(apiDocument_v001) )  

app.use('/api/v0.0.1/countries/images', express.static('./medias/images/countries'))

app.use('/api/v0.0.1', require('./api/v0.0.1/routes/index'))

app.use((err, req, res, next) => {
    if (typeof (err) === 'string') return res.status(400).send({ status: 'Failed', details: err })
    res.status(500).send({ status: 'Failed', details: err.message });
})

module.exports = app