const { body, validationResult } = require('express-validator')

const User = require('../models/users')
const sendEmail = require('../handlers/email')

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
    // create new user in database
    await User.create(req.body)

    // generate url for confirmation email
    const url = `${req.headers.origin}/confirm-account/${req.body.email}`

    // send email confirmation to user
    await sendEmail({
      user: req.body,
      subject: 'Confirm your email',
      template: 'confirm-email',
      url
    })
    // flash message and redirect to login
    req.flash('success', 'We have sent you an email to confirm your account')
    res.redirect('/login')
  } catch (error) {
    console.log(error)
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

const formLogin = (req, res) => {
  res.render('login', {
    title: 'Login'
  })
}

module.exports = {
  formSignup,
  signup,
  formLogin
}
