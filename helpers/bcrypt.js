const bcrypt = require('bcryptjs')

const generatePassword = (password) => {
    return bcrypt.hashSync(password, 10)
}

const comparePassword = (password, hashedPassword) => {
    return bcrypt.compareSync(password, hashedPassword)
}

module.exports = {
    generatePassword,
    comparePassword
}