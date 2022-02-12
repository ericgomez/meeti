const passport = require('passport')

const authenticateUser = passport.authenticate('local', {
  successRedirect: '/management',
  failureRedirect: '/login',
  failureFlash: true // enable flash message
  // badRequestMessage: 'Invalid email or password' // custom default message
})

module.exports = {
  authenticateUser
}
