const { Sequelize } = require('sequelize')

const db = new Sequelize('meeti', 'root', '123456', {
  host: 'localhost',
  dialect: 'postgres'
  // logging: false // false to disable logging in console
})

db.sync()
  .then(() => {
    console.log('Connection has been established successfully.')
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err)
  })

module.exports = db
