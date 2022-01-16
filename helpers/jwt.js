const jwt = require('jsonwebtoken')

const generateToken = (payload, secretKey) => {
    return jwt.sign(payload, secretKey)
}

const verifyToken = (token, secretKey) => {
    return jwt.verify(token, secretKey)
}

module.exports = {
    generateToken,
    verifyToken
}