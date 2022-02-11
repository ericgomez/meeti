const User = require('../models/users')

const formSignup = (req, res) => {
  res.render('signup', {
    title: 'Signup'
  })
}

const signup = async (req, res) => {
  try {
    const user = await User.create(req.body)

    console.log(`User created: ${user}`)
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  formSignup,
  signup
}
