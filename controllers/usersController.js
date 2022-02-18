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
      template: 'confirm-account',
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

const confirmAccount = async (req, res, next) => {
  // check if user exists
  const user = await User.findOne({
    where: {
      email: req.params.email
    }
  })

  if (!user) {
    req.flash('error', 'User not found')
    res.redirect('/login')

    return next()
  }

  // check if user is already active
  if (user.status) {
    req.flash('error', 'User is already active')
    res.redirect('/login')

    return next()
  }

  // update user status to active
  await user.update({
    status: true
  })

  // flash message and redirect to login
  req.flash('success', 'Your account is now active')
  res.redirect('/login')
}

const formEditProfile = async (req, res) => {
  const user = await User.findByPk(req.user.id)

  res.render('users/edit-profile', {
    title: 'Edit Profile',
    user
  })
}

const editProfile = async (req, res) => {
  const user = await User.findByPk(req.user.id)

  try {
    await user.update(req.body)

    req.flash('success', 'Profile updated successfully')
    res.redirect('/edit-profile')
  } catch (error) {
    console.log(error)
    req.flash(
      'error',
      error.errors.map(err => err.message)
    )
    res.redirect('/edit-profile')
  }
}

const formChangePassword = (req, res) => {
  res.render('users/change-password', {
    title: 'Change Password'
  })
}

const changePassword = async (req, res, next) => {
  const user = await User.findByPk(req.user.id)

  // check if password is correct
  const isPasswordCorrect = user.validPassword(req.body.currentPassword)

  if (!isPasswordCorrect) {
    req.flash('error', 'Password is incorrect')
    res.redirect('/change-password')

    return next()
  }

  // hashing new password with method from user model
  const hashPassword = user.hashPassword(req.body.newPassword)

  // update password
  await user.update({
    password: hashPassword
  })

  // logout user by passport
  req.logout()

  // flash message and redirect to login
  req.flash('success', 'Password changed successfully')
  res.redirect('/login')
}

module.exports = {
  formSignup,
  signup,
  formLogin,
  confirmAccount,
  formEditProfile,
  editProfile,
  formChangePassword,
  changePassword
}
