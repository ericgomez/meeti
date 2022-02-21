const { Router } = require('express')

const router = Router()

const {
  sanitizeFieldsMeeti,
  sanitizeFieldsProfile
} = require('./../middlewares/sanitizeFields')
const { home } = require('./../controllers/homeController')
const {
  formSignup,
  signup,
  formLogin,
  confirmAccount,
  formEditProfile,
  editProfile,
  formChangePassword,
  changePassword,
  formUploadImageProfile,
  uploadImageUser,
  uploadImageProfile
} = require('./../controllers/usersController')
const {
  authenticateUser,
  isAuthenticatedUser,
  logout
} = require('./../controllers/authController')
const { adminPanel } = require('./../controllers/adminController')
const {
  formNewGroup,
  uploadImageGroup,
  createGroup,
  formEditGroup,
  editGroup,
  formEditImage,
  editImage,
  formDeleteGroup,
  deleteGroup
} = require('./../controllers/groupsController')

const {
  formNewMeeti,
  newMeeti,
  formEditMeeti,
  editMeeti,
  formDeleteMeeti,
  deleteMeeti
} = require('./../controllers/meetiController')
const {
  getMeeti,
  confirmAssistance,
  showAssistants
} = require('./../controllers/frontend/meetiControllerFE')
const { getUser } = require('./../controllers/frontend/usersControllerFE')

router.get('/', home)

// Frontend meeti
router.get('/meeti/:slug', getMeeti)

// confirm assistance to meeti
router.post('/confirm-assistance/:slug', confirmAssistance)

// show assistants to meeti
router.get('/assistants/:slug', showAssistants)

// show user profile in the frontend
router.get('/users/:id', getUser)

router.get('/signup', formSignup)
router.post('/signup', signup)

// confirm account
router.get('/confirm-account/:email', confirmAccount)

// login
router.get('/login', formLogin)
router.post('/login', authenticateUser)

// logout
router.get('/logout', isAuthenticatedUser, logout)

// administration panel
router.get('/admin', isAuthenticatedUser, adminPanel)

// new group
router.get('/new-group', isAuthenticatedUser, formNewGroup)
router.post('/new-group', isAuthenticatedUser, uploadImageGroup, createGroup)

// edit group
router.get('/edit-group/:groupId', isAuthenticatedUser, formEditGroup)
router.post('/edit-group/:groupId', isAuthenticatedUser, editGroup)

// edit image
router.get('/image-group/:groupId', isAuthenticatedUser, formEditImage)
router.post(
  '/image-group/:groupId',
  isAuthenticatedUser,
  uploadImageGroup,
  editImage
)

// delete group
router.get('/delete-group/:groupId', isAuthenticatedUser, formDeleteGroup)
router.post('/delete-group/:groupId', isAuthenticatedUser, deleteGroup)

// new meeti
router.get('/new-meeti', isAuthenticatedUser, formNewMeeti)
router.post('/new-meeti', isAuthenticatedUser, sanitizeFieldsMeeti, newMeeti)

router.get('/edit-meeti/:id', isAuthenticatedUser, formEditMeeti)
router.post(
  '/edit-meeti/:id',
  isAuthenticatedUser,
  sanitizeFieldsMeeti,
  editMeeti
)

router.get('/delete-meeti/:id', isAuthenticatedUser, formDeleteMeeti)
router.post('/delete-meeti/:id', isAuthenticatedUser, deleteMeeti)

// profile
router.get('/edit-profile', isAuthenticatedUser, formEditProfile)
router.post(
  '/edit-profile',
  isAuthenticatedUser,
  sanitizeFieldsProfile,
  editProfile
)

// password reset
router.get('/change-password', isAuthenticatedUser, formChangePassword)
router.post('/change-password', isAuthenticatedUser, changePassword)

// image profile
router.get('/picture-profile', isAuthenticatedUser, formUploadImageProfile)
router.post(
  '/picture-profile',
  isAuthenticatedUser,
  uploadImageUser,
  uploadImageProfile
)

module.exports = router
