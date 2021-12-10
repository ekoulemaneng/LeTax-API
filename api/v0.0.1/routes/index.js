const router = require('express').Router()

router.use('/location', require('./location'))
router.use('/students', require('./students'))
router.use('/admins', require('./admins'))
router.use('/countries', require('./countries'))
router.use('/tracks', require('./tracks'))

module.exports = router