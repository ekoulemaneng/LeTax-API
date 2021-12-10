const router = require('express').Router()
const { isAdminLoggedIn } = require('../middlewares/isUserLoggedIn')
const controllers = require('../controllers/tracks')

// Add an track
router.post('/', isAdminLoggedIn, async (req, res) => {
    try {
        console.log(req.body) 
        const { name, category, diploma, school, country, description} = req.body
        const response = await controllers.addTrack(name, category, diploma, school, country, description)
        const messages = ['NoCountryWithThisId', 'TrackNameAlreadyUsed', 'DiplomaOrSchoolMustBeProvided']
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

// Get all tracks 
router.get('/', async (req, res) => {
    try {
        const response = await controllers.getAllTracks()  
        if (!response) {
            res.status(404).send({ error: 'NoTrack' })
            return
        }
        res.send(response)
    } 
    catch (error) {
        console.error(error)
        res.status(404).send({ error: error })
    }
})

// Get tracks by category and country
router.get('/search', async (req, res) => {
    try {
        const { category, country } = req.query
        const response = await controllers.getTracksByCategoryAndCountry(category, country)   
        const messages = ['CategoryAndCountryNotProvided', 'NoTrack', 'NoCountryWithThisId']
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

// Get a track by id
router.get('/:trackId', async (req, res) => {
    try {
        const trackId = req.params.trackId
        const response = await controllers.getTrackById(trackId)  
        const messages = ['NoTrackWithThisId', 'NoCountryWithThisId']
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

// Update a track
router.put('/:trackId', isAdminLoggedIn, async (req, res) => {
    try {
        const trackId = req.params.trackId
        const { name, category, diploma, school, country, description } = req.body
        const response = await controllers.updateTrack(trackId, name, category, diploma, school, country, description)
        let messages = ['NoTrackWithThisId', 'NoCountryWithThisId']
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

// Delete a track
router.delete('/:trackId', isAdminLoggedIn, async (req, res) => {
    try {
        const trackId = req.params.trackId
        const email = req.user.email
        const password = req.body.password
        const response = await controllers.deleteTrack(trackId, email, password)
        const messages = ['NoTrackWithThisId', 'NoAdminWithThisEmail', 'IncorrectPassword', 'SystemFailure']
        if (response === true) {
            res.send({ details: 'TrackSuccessfullyDeleted'})
            return
        }
        res.status(404).send({ error: messages[response] })
    } 
    catch (error) {
        console.log(error)
        res.status(404).send({ error: error })
    }
})

module.exports = router