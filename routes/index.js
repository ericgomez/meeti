const { Router } = require('express')

const router = Router()

const { home } = require('./../controllers/homeController')
const {
  formSignup,
  signup,
  formLogin,
  confirmAccount
} = require('./../controllers/usersController')
const {
  authenticateUser,
  isAuthenticatedUser
} = require('./../controllers/authController')
const { adminPanel } = require('./../controllers/adminController')
const {
  formNewGroup,
  createGroup
} = require('./../controllers/groupsController')

router.get('/', home)

router.get('/signup', formSignup)
router.post('/signup', signup)

// confirm account
router.get('/confirm-account/:email', confirmAccount)

// login
router.get('/login', formLogin)
router.post('/login', authenticateUser)

// administration panel
router.get('/admin', isAuthenticatedUser, adminPanel)

// new group
router.get('/new-group', isAuthenticatedUser, formNewGroup)
router.post('/new-group', isAuthenticatedUser, createGroup)

module.exports = router
