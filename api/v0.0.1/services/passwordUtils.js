const bcrypt = require('bcrypt')

const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(process.env.SALT_ROUNDS)
    return await bcrypt.hash(password, salt)
}

const checkPassword = async (plainTextPassword, hashedPassword) => {
    return await bcrypt.compare(plainTextPassword, hashedPassword) 
}

module.exports = {hashPassword, checkPassword}