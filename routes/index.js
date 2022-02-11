const { Router } = require('express')
const router = Router()

const { home } = require('./../controllers/homeController')
const { formSignup } = require('./../controllers/usersController')

router.get('/', home)

router.get('/signup', formSignup)

module.exports = router
