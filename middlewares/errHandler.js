function errHandler (err, req, res, next) {
  if (err.name === 'SequelizeValidationError') {
    const arr = []
    for (let i = 0; i < err.errors.length; i++) {
      arr.push(err.errors[i].message)
    }
    const message = arr.join(', ')
    res.status(400).json({
      msg: message
    })
  } else if (err.name === 'SequelizeUniqueConstraintError') {
    res.status(400).json({
      msg: err.errors[0].message
    })
  } else if (err.code) {
    res.status(err.code).json({
      msg: err.msg
    })
  } else {
    res.status(500).json({
      msg: 'Internal Server Error'
    })
  }
}

module.exports = errHandler