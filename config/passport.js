const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('../models/users')

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email' // change field username default to email
    },
    // NOTE: done is equal next
    async (email, password, done) => {
      // is executed when filling the form
      const user = await User.findOne({ where: { email, status: true } })

      if (!user) return done(null, false, { message: 'User not found' })

      // method to validate password from user model
      const match = user.validPassword(password)

      if (!match) return done(null, false, { message: 'Wrong password' })

      // if everything is ok, return user
      return done(null, user)
    }
  )
)

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((user, done) => {
  done(null, user)
})

module.exports = passport
