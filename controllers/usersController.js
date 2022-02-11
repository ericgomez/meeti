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
    // get only the errors message
    const errorsSequelize = error.errors.map(err => err.message)
    // console.log(errorsSequelize)

    req.flash('error', errorsSequelize)
    res.redirect('/signup')
  }
}

module.exports = {
  formSignup,
  signup
}
