const { Router } = require('express')
const router = Router()

router.get('/', (req, res) => {
  res.send('Homepage')
})

router.get('/signup', (req, res) => {
  res.send('Signup')
})

module.exports = router
