const fs = require('fs')

const User = require('../models/users')
const sendEmail = require('../handlers/email')
const multer = require('../middlewares/fileUploadUser')
const { validateFieldsUser } = require('../middlewares/validateFields')

const uploadImageUser = async (req, res, next) => {
  const upload = multer.single('image')

  upload(req, res, async error => {
    if (error) {
      if (error.code === 'LIMIT_FILE_SIZE') {
        req.flash('error', 'The file size is too big')
      } else if (error.hasOwnProperty('message')) {
        // access the error message directly of new Error
        req.flash('error', error.message)
      } else {
        req.flash('error', error.message)
      }
      // redirect to back
      return res.redirect('back')
    } else {
      next()
    }
  })
}

const formSignup = (req, res) => {
  res.render('signup', {
    title: 'Signup'
  })
}

const signup = async (req, res) => {
  const errorsExp = await validateFieldsUser(req)

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

const formUploadImageProfile = async (req, res) => {
  const user = await User.findByPk(req.user.id)

  res.render('users/picture-profile', {
    title: 'Upload Image Profile',
    user
  })
}

const uploadImageProfile = async (req, res) => {
  const user = await User.findByPk(req.user.id)

  if (!user) {
    req.flash('error', 'You are not the owner of this user')
    res.redirect('back')

    return next()
  }

  // check if a previous image exists and a new image exists
  if (req.file && user.image) {
    const pathImage = `./public/uploads/profiles/${user.image}`

    // delete the previous image asynchronously
    // no required await because it is not a blocking operation
    fs.unlink(pathImage, error => {
      if (error) {
        console.log(error)
      }

      return
    })
  }

  // add only name of image
  if (req.file) {
    user.image = req.file.filename
  }

  try {
    await user.save()

    req.flash('success', `Image of ${user.name} was updated successfully`)
    res.redirect('/admin')
  } catch (error) {
    console.log(error)
    // get only the errors message from Sequelize
    const errorsSequelize = error.errors.map(err => err.message)

    req.flash('error', errorsSequelize)
    res.redirect('/edit-image')
  }
}

module.exports = {
  formSignup,
  signup,
  formLogin,
  confirmAccount,
  formEditProfile,
  editProfile,
  formChangePassword,
  changePassword,
  formUploadImageProfile,
  uploadImageUser,
  uploadImageProfile
}
