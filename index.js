const express = require('express')
require('dotenv').config()

const router = require('./routes')

const app = express()

// routing
app.use('/', router)

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`)
})
