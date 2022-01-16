const router = require('express').Router()
const User = require('../controllers/user')
const Classroom = require('../controllers/classroom')
const {authenticate, authorizeAdmin} = require('../middlewares/auth')

router.post('/register', User.register)
router.post('/login', User.login)
router.use(authenticate)
router.post('/new-class', authorizeAdmin, Classroom.create)

module.exports = router