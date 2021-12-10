const validator = require('../services/requestsValidator')

const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/


const signUpRequestsValidator = (req, res, next) => {
    const { email } = req.body
    if (!validator.allDataProvided(req.body)) {
        res.status(400).send({ error: 'AllDataRequiredNotProvided' })
        return
    }
    if (!validator.isStringMatchRegex(email, emailRegex)) {
        res.status(400).send({ error: 'EmailNotCorrect' })
        return
    }
    next()
}

module.exports = signUpRequestsValidator