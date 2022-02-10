const express = require('express')
require('dotenv').config()

const router = require('./routes')

const app = express()

// enabling ejs with template engine
app.set('view engine', 'ejs')

// location views
app.set('views', 'views')

// enabling static files
app.use(express.static('public'))

// routing
app.use('/', router)

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`)
})
