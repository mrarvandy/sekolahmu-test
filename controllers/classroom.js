const {Class} = require('../models')

class ClassController {
  static create (req, res, next) {
    const {column, row, name} = req.body
    const dict = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const arr = []
    for (let i = 0; i < column; i++) {
      for (let j = 1; j <= row; j++) {
        if (i > 26) {
          arr.push(`${j}${dict[Math.floor(i/26) - 1]}${dict[i % 26]}`)
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
}

module.exports = ClassController