const router = require('express').Router()
const signUpRequestsValidator = require('../middlewares/signUpRequestsValidator')
const signInRequestsValidator = require('../middlewares/signInRequestsValidator')
const { adminAuthentication } = require('../middlewares/userAuth') 
const { isAdminLoggedIn } = require('../middlewares/isUserLoggedIn')
const controllers = require('../controllers/admins')

// Create a new admin account
router.post('/', signUpRequestsValidator, async (req, res) => {
    try {
        const { name, email, password } = req.body
        const response = await controllers.createAdmin(name, email, password)
        if (!response) {
            res.status(404).send({ error: 'EmailAlreadyUsed' })
            return
        } 
        res.send(response) 
    }
    catch (error) {
        console.error(error)
        res.status(404).send({ error: error })
    }
})

// Log in a admin account
router.post('/login', signInRequestsValidator, adminAuthentication)



// Get a admin account details
router.get('/', isAdminLoggedIn, async (req, res) => {
    try {
        const email = req.user.email
        const response = await controllers.getAdminByEmail(email)
        if (!response) {
            res.status(404).send({ error: 'NoAdminWithThisEmail' })
            return
        } 
        res.send(response)
    } 
    catch (error) {
        console.error(error)
        res.status(404).send({ error: error })
    }
})

// Update admin name
router.put('/name', isAdminLoggedIn, async (req, res) => {
    try {
        const email = req.user.email
        const name = req.body.name
        const response = await controllers.updateAdminName(email, name)
        if (!response) {
            res.status(404).send({ error: 'NoAdminWithThisEmail' })
            return
        }
        res.send(response) 
    } 
    catch (error) {
        console.error(error)
        res.status(404).send({ error: error })
    }
})

// Update admin password
router.put('/password', isAdminLoggedIn, async (req, res) => {
    try {
        const email = req.user.email
        const { oldPassword, newPassword } = req.body
        const response = await controllers.updateAdminPassword(email, oldPassword, newPassword)
        const messages = ['NoAdminWithThisEmail', 'IncorrectPassword']
        if (response === true) {
            res.send({ details: 'PasswordSuccessfullyModified' })
            return
        }
        res.status(404).send({ error: messages[response] })
    } 
    catch (error) {
        console.error(error)
        res.status(404).send({ error: error })
    }
})

// Delete admin account
router.delete('/', isAdminLoggedIn, async (req, res) => {
    try {
        const email = req.user.email
        const password = req.body.password
        const response = await controllers.deleteAdmin(email, password)
        const messages = ['NoAdminWithThisEmail', 'IncorrectPassword', 'SystemFailure']
        if (response === true) {
            res.send({ details: 'AdminSuccessfullyDeleted' })
            return
        }
        res.status(404).send({ error: messages[response] })
    } 
    catch (error) {
        console.error(error)
        res.status(404).send({ error: error })
    }
})

module.exports = router

