const { user } = require('pg/lib/defaults')
const {Class, User} = require('../models')

class ClassController {
  static create (req, res, next) {
    const {column, row, name} = req.body
    const dict = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const arr = []
    for (let i = 0; i < column; i++) {
      for (let j = 1; j <= row; j++) {
        if (i > 26) {
          arr.push(`${j}${dict[Math.floor(i/26) - 1]}${dict[i - (Math.floor(i/26) * 26)]}`)
        } else {
          arr.push(`${j}${dict[i]}`)
        }
      }
    }
    const obj = {
      teacher: {
        id: '',
        username: '',
        name: ''
      },
      students: []
    }
    for (let i = 0; i < arr.length; i++) {
      obj.students.push({
        seat: arr[i],
        student_id: '',
        student_username: '',
        student_name: ''
      })
    }
    Class.create({
      name,
      users: obj
    })
    .then((data) => {
      res.status(201).json({
        id: data.id,
        name: data.name,
        users: data.users
      })
    })
    .catch((err) => {
      next(err)
    })
  }

  static async checkIn (req, res, next) {
    const {class_id, user_id} = req.body
    try {
      const user_data = await User.findOne({
        where: {
          id: user_id
        }
      })
      if (!user_data) {
        throw new Error({
          code: '400',
          message: 'Nonexistent User'
        })
      }
      const class_data = await Class.findOne({
        where: {
          id: class_id
        }
      })
      if (user_data.role === 'Admin') {
        res.status(201).json({
          id: class_data.id,
          name: class_data.name,
          users: class_data.users
        })
      } else if (user_data.role === 'Teacher') {
        let msg = ''
        if (class_data.dataValues.users.teacher.name) {
          if (class_data.dataValues.users.teacher.username === user_data.username) {
            msg = 'Already entered this classroom'
          } else {
            msg = 'Another teacher has been occupied this classroom'
          }
        } else {
          class_data.dataValues.users.teacher.id = user_data.id
          class_data.dataValues.users.teacher.name = user_data.name
          class_data.dataValues.users.teacher.username = user_data.username
          Class.update({
            id: class_data.dataValues.id,
            name: class_data.dataValues.name,
            users: class_data.dataValues.users
          }, {
            where: {
              id: class_data.dataValues.id
            }
          })
          msg = `Successfully entered ${class_data.dataValues.name}`
        }
        res.status(201).json({
          id: class_data.dataValues.id,
          name: class_data.dataValues.name,
          users: class_data.dataValues.users,
          message: msg
        })
      } else if (user_data.role === 'Student') {
        let msg = ''
        let availableSeatCounter = 0
        let resSeat = ''
        for (let i = 0; i < class_data.dataValues.users.students.length; i++) {
          if (!class_data.dataValues.users.students[i].student_username) {
            availableSeatCounter += 1
          }
          if (class_data.dataValues.users.students[i].student_username === user_data.username) {
            resSeat = class_data.dataValues.users.students[i].seat  
          }
        }
        if (availableSeatCounter > 0) {
          for (let i = 0; i < class_data.dataValues.users.students.length; i++) {
            if (!resSeat) {
              if (!class_data.dataValues.users.students[i].student_username) {
                resSeat = class_data.dataValues.users.students[i].seat
                class_data.dataValues.users.students[i].student_id = user_data.id
                class_data.dataValues.users.students[i].student_name = user_data.name
                class_data.dataValues.users.students[i].student_username = user_data.username
              }
            }
          }
          const dict = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
          let column = 0
          if (resSeat.length === 2) {
            for (let i = 0; i < dict.length; i++) {
              if (dict[i] === resSeat[1]) {
                column = i + 1
              }
            }
          } else if (resSeat.length === 3) {
            let res = 0
            for (let i = 0; i < dict.length; i++) {
              if (dict[i] === resSeat[1]) {
                res += (i + 1) * 26
              }
            }
            for (let i = 0; i < dict.length; i++) {
              if (dict[i] === resSeat[2]) {
                res = i + 1
              }
            }
            column = res
          }
          msg = `Hi ${user_data.name}, your seat is ${resSeat} in row ${Number(resSeat[0])} and column ${column}`
          Class.update({
            id: class_data.dataValues.id,
            name: class_data.dataValues.name,
            users: class_data.dataValues.users
          }, {
            where: {
              id: class_data.dataValues.id
            }
          })
        } else {
          msg = 'The class is fully seated'
        }
        res.status(201).json({
          id: class_data.dataValues.id,
          name: class_data.dataValues.name,
          users: class_data.dataValues.users,
          message: msg
        })
      }
    } catch (err) {
      next(err)
    }
  }

  static async checkOut (req, res, next) {
    const {class_id, user_id} = req.body
    try {
      const user_data = await User.findOne({
        where: {
          id: user_id
        }
      })
      if (!user_data) {
        throw new Error({
          code: '400',
          message: 'Nonexistent User'
        })
      }
      const class_data = await Class.findOne({
        where: {
          id: class_id
        }
      })
      if (user_data.role === 'Admin') {
        res.status(201).json({
          id: class_data.id,
          name: class_data.name,
          users: class_data.users
        })
      } else if (user_data.role === 'Teacher') {
        let msg = ''
        if (class_data.dataValues.users.teacher.name) {
          if (class_data.dataValues.users.teacher.name !== user_data.name) {
            throw new Error({
              code: '403',
              message: 'Different User'
            })
          } else {
            class_data.dataValues.users.teacher.id = ''
            class_data.dataValues.users.teacher.name = ''
            class_data.dataValues.users.teacher.username = ''
            Class.update({
              id: class_data.dataValues.id,
              name: class_data.dataValues.name,
              users: class_data.dataValues.users
            }, {
              where: {
                id: class_data.dataValues.id
              }
            })
            msg = `Successfully exited from ${class_data.dataValues.name}`
          }
        } else {
          msg = 'Already no teachers is in this classroom'
        }
        res.status(201).json({
          id: class_data.dataValues.id,
          name: class_data.dataValues.name,
          users: class_data.dataValues.users,
          message: msg
        })
      } else if (user_data.role === 'Student') {
        let msg = ''
        let flag = false
        for (let i = 0; i < class_data.dataValues.users.students.length; i++) {
          if (class_data.dataValues.users.students[i].student_username === user_data.username) {
            flag = true
            class_data.dataValues.users.students[i].student_id = ''
            class_data.dataValues.users.students[i].student_name = ''
            class_data.dataValues.users.students[i].student_username = ''
          }
        }
        if (!flag) {
          msg = 'Already not entered this classroom'
        } else {
          msg = 'Successfully check out from this classroom'
          Class.update({
            id: class_data.dataValues.id,
            name: class_data.dataValues.name,
            users: class_data.dataValues.users
          }, {
            where: {
              id: class_data.dataValues.id
            }
          })
        }
        res.status(201).json({
          id: class_data.id,
          name: class_data.name,
          users: class_data.users,
          message: msg
        })
      }
    } catch (err) {
      next(err)
    }
  }

  static list (req, res, next) {
    Class.findAll({
      attributes: ['id', 'name']
    })
    .then((data) => {
      res.status(200).json({
        data
      })
    })
    .catch((err) => {
      next(err)
    })
  }

  static getDetail (req, res, next) {
    const id = req.params.id
    Class.findOne({
      where: {
        id
      }
    })
    .then((data) => {
      if (data) {
        res.status(200).json({
          data
        })
      } else {
        next({
          code: 400,
          msg: 'Nonexistent class'
        })
      }
    })
    .catch((err) => {
      next(err)
    })
  }
}

module.exports = ClassController