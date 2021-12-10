const validator = require('../services/requestsValidator')

const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/


const requestsSignUpValidator = (req, res, next) => {
    const { email, password, repeat_password } = req.body
    if (!validator.allDataProvided(req.body)) {
        res.status(400).send({ error: 'AllDataRequiredNotProvided' })
        return 
    }
    if (!validator.isStringMatchRegex(email, emailRegex)) {
        res.status(400).send({ error: 'EmailNotCorrect' })
        return
    }
    if (!validator.areSameStrings(password, repeat_password)) {
        res.status(400).send({ error: "PasswordsMustBeSame" })
        return
    }
    next()
}

module.exports = requestsSignUpValidator