const passport = require('passport')

const authenticateUser = passport.authenticate('local', {
  successRedirect: '/admin',
  failureRedirect: '/login',
  failureFlash: true // enable flash message
  // badRequestMessage: 'Invalid email or password' // custom default message
})

// user is authenticated
const isAuthenticatedUser = (req, res, next) => {
  // if user is authenticated, continue
  // isAuthenticated is a method of passport
  if (req.isAuthenticated()) return next()

  // if not, redirect to login
  res.redirect('/login')
}

const logout = (req, res) => {
  req.logout()
  res.redirect('/login')

  // next()
}

module.exports = {
  authenticateUser,
  isAuthenticatedUser,
  logout
}
