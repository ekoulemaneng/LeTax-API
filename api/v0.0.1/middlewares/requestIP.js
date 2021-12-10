const {getClientIp} = require('@supercharge/request-ip')

const requestIP = (req, res, next) => {
    req.ipAddress = getClientIp(req)
    next()
}

module.exports = requestIP