const Student = require('../models/students')
const Admin = require('../models/admins')
const {checkPassword} = require('../services/passwordUtils')

const generateAuthenticationStrategy = (User, role) => {
  return async (req, res) => {
    try {
      const { email, password } = req.body
      if (!email) return res.status(400).send({ error: 'EmailRequired'})
      if (!password) return res.status(400).send({ error: 'PasswordRequired'})
      const user = await User.findOne({ email })
      if (!user) return res.status(400).send({ error: `No${role}WithThisEmail` }) 
      if (!(await checkPassword(password, user.password))) return res.status(400).send({ error: 'IncorrectPassword' })
      const token = await user.createToken()
      return res.send({ id: user._id, token: token })
    } 
    catch (error) {
      console.error(error)
      res.status(404).send({ error: error })
    }
  }
}

const studentAuthentication = generateAuthenticationStrategy(Student, 'Student')
const adminAuthentication = generateAuthenticationStrategy(Admin, 'Admin')

module.exports = { studentAuthentication, adminAuthentication }