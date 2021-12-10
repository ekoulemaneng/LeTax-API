const multer = require('multer')
const path = require('path')

const countryImageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './medias/images/countries')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

module.exports = multer({ storage: countryImageStorage }).single('image')