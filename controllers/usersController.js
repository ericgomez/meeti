const User = require('../models/users')

const formSignup = (req, res) => {
  res.render('signup', {
    title: 'Signup'
  })
}

const signup = async (req, res) => {
  const user = await User.create(req.body)

  console.log(`User created: ${user}`)
}

module.exports = {
  formSignup,
  signup
}
