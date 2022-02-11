const { body, validationResult } = require('express-validator')
const User = require('../models/users')

const formSignup = (req, res) => {
  res.render('signup', {
    title: 'Signup'
  })
}

const signup = async (req, res) => {
  const rules = [
    body('confirm-password')
      .notEmpty()
      .withMessage('Confirm password is required'),
    body('confirm-password')
      .equals(req.body.password)
      .withMessage('Confirm password must be the same as password')
  ]

  await Promise.all(rules.map(validation => validation.run(req)))

  const errorsExp = validationResult(req)

  try {
    const user = await User.create(req.body)

    console.log(`User created: ${user}`)
  } catch (error) {
    // get only the errors message from Sequelize
    const errorsSequelize = error.errors.map(err => err.message)

    // get only the errors message from express-validator
    const errorsExpress = errorsExp.errors.map(err => err.msg)

    // merge both errors
    const listErrors = [...errorsSequelize, ...errorsExpress]

    req.flash('error', listErrors)
    res.redirect('/signup')
  }
}

module.exports = {
  formSignup,
  signup
}
