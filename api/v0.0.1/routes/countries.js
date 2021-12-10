const router = require('express').Router()
const { isAdminLoggedIn } = require('../middlewares/isUserLoggedIn')
const imageUploader = require('../middlewares/fileUploader')
const controllers = require('../controllers/countries')

// Add a country
router.post('/', isAdminLoggedIn, imageUploader, async (req, res) => {
    try {
        const { name, code } = req.body
        const imageFilename = req.file.filename
        const response = await controllers.addCountry(name, code, imageFilename)
        const messages = ['CountryNameAlreadyUsed', 'CountryCodeAlreadyUsed']
        if (!isNaN(response)) {
            res.status(404).send({ error: messages[response] })
            return
        }
        res.send(response)
    }
    catch (error) {
        console.log(error)
        res.status(404).send({ error: error })
    }

})

// Get all countries 
router.get('/', async (req, res) => {
    try {
        const response = await controllers.getAllCountries()  
        if (!response) return res.status(404).send({ error: 'NoCountry' })
        return res.send(response)
    } 
    catch (error) {
        console.log(error)
        res.status(404).send({ error: error })
    }
})

// Get a country by code
router.get('/search', async (req, res) => {
    try {
        const code = req.query.code
        const response = await controllers.getCountryByCode(code)   
        if (!response) return res.status(404).send({ error: 'NoCountryWithThisCode' })
        return res.send(response)
    } 
    catch (error) {
        console.log(error)
        res.status(404).send({ error: error })
    }
})

// Get a country by id
router.get('/:countryId', async (req, res) => {
    try {
        const countryId = req.params.countryId
        const response = await controllers.getCountryById(countryId)   
        if (!response) return res.status(404).send({ error: 'NoCountryWithThisId' })
        return res.send(response)
    } 
    catch (error) {
        console.log(error)
        res.status(404).send({ error: error })
    }
})

// Update a country infos
router.put('/:countryId/infos', isAdminLoggedIn, async (req, res) => {
    try {
        const countryId = req.params.countryId
        const { name, code } = req.body
        const response = await controllers.updateCountryInfos(countryId, name, code) 
        const messages = ['NoCountryWithThisId', 'CountryNameAlreadyUsed', 'CountryCodeAlreadyUsed']
        if (!isNaN(response)) return res.status(404).send({ error: messages[response] })
        return res.send(response)
    } 
    catch (error) {
        console.log(error)
        res.status(404).send({ error: error })
    }
})

// Update a country image
router.put('/:countryId/image', isAdminLoggedIn, imageUploader, async (req, res) => {
    try {
        const countryId = req.params.countryId
        const imageFileName = req.file.filename
        const response = await controllers.updateCountryImage(countryId, imageFileName) 
        if (!response) return res.status(404).send({ error: 'NoCountryWithThisId' })
        return res.send(response)
    } 
    catch (error) {
        console.log(error)
        res.status(404).send({ error: error })
    }
})

// Delete a country
router.delete('/:countryId', isAdminLoggedIn, async (req, res) => {
    try {
        const countryId = req.params.countryId
        const response = await controllers.deleteCountry(countryId)
        const messages = ['NoCountryWithThisId', 'SystemFailure']
        if (response === true) return res.send({ details: 'CountrySuccessfullyDeleted' })
        return res.status(404).send({ error: messages[response] })
    } 
    catch (error) {
        console.log(error)
        res.status(404).send({ error: error })
    }
})

module.exports = router