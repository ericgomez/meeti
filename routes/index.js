const { Router } = require('express')

const router = Router()

const { home } = require('./../controllers/homeController')
const { formSignup, signup } = require('./../controllers/usersController')

router.get('/', home)

router.get('/signup', formSignup)
router.post('/signup', signup)

module.exports = router
