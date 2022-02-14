const { Router } = require('express')

const router = Router()

const { home } = require('./../controllers/homeController')
const {
  formSignup,
  signup,
  formLogin,
  confirmAccount
} = require('./../controllers/usersController')
const { authenticateUser } = require('./../controllers/authController')
const { adminPanel } = require('./../controllers/adminController')

router.get('/', home)

router.get('/signup', formSignup)
router.post('/signup', signup)

// confirm account
router.get('/confirm-account/:email', confirmAccount)

// login
router.get('/login', formLogin)
router.post('/login', authenticateUser)

// administration panel
router.get('/admin', adminPanel)

module.exports = router
