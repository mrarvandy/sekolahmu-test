const {User, Cart} = require('../models')
const {verifyToken} = require('../helpers/jwt')

async function authenticate (req, res, next) {
  try {
    const user = verifyToken(req.headers.token, process.env.SECRETKEY)
    console.log(user)
    const data = await User.findOne({
      where: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role
      }
    })
    if (data) {
      req.currentUser = {
        id: data.id,
        username: data.username,
        name: data.name,
        role: data.role
      }
      next()
    } else {
      throw new Error()
    }
  } catch (err) {
    next(err)
  }
}

function authorizeAdmin (req, res, next) {
  const {id, username, name, role} = req.currentUser
  User.findOne({
    where: {
      id,
      username,
      name,
      role
    }
  })
  .then((data) => {
    const valid = data.role === 'Admin'
    if (valid) {
      next()
    } else {
      next({
        code: 401,
        message: 'Not Authorized'
      })
    }
  })
  .catch((err) => {
    next(err)
  })
}

module.exports = {
  authenticate,
  authorizeAdmin
}