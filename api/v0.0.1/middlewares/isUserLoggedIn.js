const jwt = require('jsonwebtoken')
const { secretKey } = require('../../../config')

const isUserLoggedIn =  (role) => {
    return  async (req, res, next) => {
        try {
            const token = req.headers.authorization
            if (!token) {
                res.status(401).send({ error: 'NotLoggedIn' })
                return
            }
            const userData = await jwt.verify(token, secretKey)
            if (userData.role != role) {
                res.status(401).send({ error: 'NotAuthorized' })
                return
            }
            req.user = userData
            next()
        } 
        catch (error) {
            console.error(error)
            next(error)
        }
    }
}

const isStudentLoggedIn = isUserLoggedIn('student')
const isTeacherLoggedIn = isUserLoggedIn('teacher')
const isAdminLoggedIn = isUserLoggedIn('admin')

module.exports = { isStudentLoggedIn, isTeacherLoggedIn, isAdminLoggedIn }