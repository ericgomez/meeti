const { Router } = require('express')

const router = Router()

const { sanitizeFieldsMeeti } = require('./../middlewares/sanitizeFields')
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
  uploadImage,
  createGroup,
  formEditGroup,
  editGroup,
  formEditImage,
  editImage,
  formDeleteGroup,
  deleteGroup
} = require('./../controllers/groupsController')

const { formNewMeeti, newMeeti } = require('./../controllers/meetiController')

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
router.post('/new-group', isAuthenticatedUser, uploadImage, createGroup)

// edit group
router.get('/edit-group/:groupId', isAuthenticatedUser, formEditGroup)
router.post('/edit-group/:groupId', isAuthenticatedUser, editGroup)

// edit image
router.get('/image-group/:groupId', isAuthenticatedUser, formEditImage)
router.post(
  '/image-group/:groupId',
  isAuthenticatedUser,
  uploadImage,
  editImage
)

// delete group
router.get('/delete-group/:groupId', isAuthenticatedUser, formDeleteGroup)
router.post('/delete-group/:groupId', isAuthenticatedUser, deleteGroup)

// new meeti
router.get('/new-meeti', isAuthenticatedUser, formNewMeeti)
router.post('/new-meeti', isAuthenticatedUser, sanitizeFieldsMeeti, newMeeti)

module.exports = router
