const { Router } = require('express')

const router = Router()

const { home } = require('./../controllers/homeController')
const {
  formSignup,
  signup,
  formLogin
} = require('./../controllers/usersController')

router.get('/', home)

router.get('/signup', formSignup)
router.post('/signup', signup)

// login
router.get('/login', formLogin)

module.exports = router
