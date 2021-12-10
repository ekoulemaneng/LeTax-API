const router = require('express').Router()
const requestIP = require('../middlewares/requestIP')
const getLocation  = require('../controllers/location')

/**
 * @api {get} /api/v0.0.1/location Get user location
 * @apiName GetLocation
 * @apiGroup Location
 * @apiVersion 0.0.0
 * @apiSuccess {String} country Name of the country
 * @apiSuccess {String} code ISO code of the country
 * @apiSuccessExample {json} Success-Response:
 *      HTTP/1.1 200 OK
 *     {
 *       "country": "Angola",
 *       "code": "AO"
 *     }
 */
router.get('/', requestIP, async (req, res) => {
    try {
        const ip = req.ipAddress
        const data = (await getLocation(ip)).data.geo
        res.send({ country: data.country_name, code: data.country_code })
    } 
    catch (error) {
        console.error(error)
        res.status(400).send({
            status: "Failed",
            details: error
        })
    }
})

module.exports = router