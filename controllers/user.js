const {User} = require('../models')
const {comparePassword} = require('../helpers/bcrypt')
const {generateToken} = require('../helpers/jwt')

class UserController {
  static register (req, res, next) {
    const {username, name, password, role} = req.body
    User.create({
      username,
      name,
      password,
      role
    })
    .then((data) => {
      res.status(201).json({
        id: data.id,
        username: data.username,
        name: data.name,
        role: data.role
      })
    })
    .catch((err) => {
      next(err)
    })
  }

  static login (req, res, next) {
      const {username, password} = req.body
      User.findOne({
        where: {
          username
        }
      })
      .then((data) => {
        if (data) {
          const valid = comparePassword(password, data.password)
          if (valid) {
            const token = generateToken({
              id: data.id,
              username: data.username,
              name: data.name,
              role: data.role
            }, process.env.SECRETKEY)
            res.status(200).json({
              token: token
            })
          } else {
            next({
              code: 403,
              message: 'Invalid Username / Password'
            })
          }
        } else {
          next({
            code: 403,
            message: 'Invalid Username / Password'
          })
        }
      })
      .catch((err) => {
        next(err)
      })
  }
}

module.exports = UserController