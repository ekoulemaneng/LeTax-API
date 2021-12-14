const router = require('express').Router()
const signUpRequestsValidator = require('../middlewares/signUpRequestsValidator')
const signInRequestsValidator = require('../middlewares/signInRequestsValidator')
const { studentAuthentication } = require('../middlewares/userAuth') 
const { isStudentLoggedIn } = require('../middlewares/isUserLoggedIn')
const controllers = require('../controllers/students')

// Create a new student account
router.post('/', signUpRequestsValidator, async (req, res) => {
    try {
        const { name, email, password } = req.body
        const response = await controllers.createStudent(name, email, password)
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

// Log in a student account
router.post('/login', signInRequestsValidator, studentAuthentication)

// Get  student account details
router.get('/', isStudentLoggedIn, async (req, res) => {
    try {
        const email = req.user.email
        const student = await controllers.getStudentByEmail(email)
        if (!student) {
            res.status(404).send({ error: 'NoStudentWithThisEmail' })
            return
        } 
        res.send(student)
    } 
    catch (error) {
        console.error(error)
        res.status(404).send({ error: error })
    }
})

// Update student name
router.put('/name', isStudentLoggedIn, async (req, res) => {
    try {
        const email = req.user.email
        const name = req.body.name
        const student = await controllers.updateStudentName(email, name)
        if (!student) {
            res.status(404).send({ error: 'NoStudentWithThisEmail' })
            return
        }
        res.send(student) 
    } 
    catch (error) {
        console.error(error)
        res.status(404).send({ error: error })
    }
})

// Update student password
router.put('/password', isStudentLoggedIn, async (req, res) => {
    try {
        const email = req.user.email
        const { oldPassword, newPassword } = req.body
        const response = await controllers.updateStudentPassword(email, oldPassword, newPassword)
        const messages = ['NoStudentWithThisEmail', 'IncorrectPassword']
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

// Add a track
router.put('/tracks/:trackId/addtrack', isStudentLoggedIn, async (req, res) => {
    try {
        const email = req.user.email
        const trackId = req.params.trackId
        const response = await controllers.addTrack(email, trackId)
        const messages = ['NoStudentWithThisEmail', 'NoTrackWithThisId', 'TrackAlreadyAdded']
        if (!isNaN(response)) {
            res.status(404).send({ error: messages[response] })
            return
        }
        res.send(response)
    } 
    catch (error) {
        console.error(error)
        res.status(404).send({ error: error })
    }
})

// Remove a track
router.put('/tracks/:trackId/removetrack', isStudentLoggedIn, async (req, res) => {
    try {
        const email = req.user.email
        const trackId = req.params.trackId
        const response = await controllers.removeTrack(email, trackId)
        const messages = ['NoStudentWithThisEmail', 'NoTrackWithThisId', 'NoTrackSubscribed', 'SystemFailure']
        if (!isNaN(response)) {
            res.status(404).send({ error: messages[response] })
            return
        }
        res.send(response)
    } 
    catch (error) {
        console.error(error)
        res.status(404).send({ error: error })
    }
})

// Delete student account
router.delete('/', isStudentLoggedIn, async (req, res) => {
    try {
        const email = req.user.email
        const password = req.body.password
        const response = await controllers.deleteStudent(email, password)
        const messages = ['NoStudentWithThisEmail', 'IncorrectPassword', 'SystemFailure']
        if (response === true) {
            res.send({ details: 'StudentSuccessfullyDeleted' })
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

