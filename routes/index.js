const { Router } = require('express')
const router = Router()

router.get('/', (req, res) => {
  res.render('home')
})

router.get('/signup', (req, res) => {
  res.render('signup')
})

module.exports = router
