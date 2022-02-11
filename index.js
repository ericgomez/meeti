const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')
const flash = require('connect-flash')
const session = require('express-session')
require('dotenv').config()

const db = require('./config/db')
require('./models/users')

const router = require('./routes')

const app = express()

// body parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// enabling ejs with template engine
app.set('view engine', 'ejs')

app.use(expressLayouts)

// location views
app.set('views', 'views')

// enabling static files
app.use(express.static('public'))

// creating session
// Since version 1.5.0 express-session, the cookie-parser middleware no longer needs to be used for this purpose.
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
    }
  })
)

// enabling flash messages
app.use(flash())

// middleware (user logged, flash message, current date)
app.use((req, res, next) => {
  res.locals.messages = req.flash()

  const date = new Date()
  res.locals.year = date.getFullYear()

  next()
})

// routing
app.use('/', router)

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`)
})
