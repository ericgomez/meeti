const { Sequelize } = require('sequelize')
const bcrypt = require('bcryptjs')

const db = require('../config/db')

const User = db.define(
  'user',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: Sequelize.STRING(60),
    image: Sequelize.STRING(60),
    email: {
      type: Sequelize.STRING(30),
      allowNull: false, // not null
      validate: {
        isEmail: {
          msg: 'Invalid email format'
        }
      },
      unique: {
        msg: 'Email already exists'
      }
    },
    password: {
      type: Sequelize.STRING(60),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Password cannot be empty'
        }
      }
    },
    description: Sequelize.TEXT,
    status: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    token: Sequelize.STRING,
    tokenExp: Sequelize.DATE
  },
  {
    hooks: {
      beforeCreate: user => {
        const salt = bcrypt.genSaltSync(10)
        user.password = User.prototype.hashPassword(user.password)
      }
    }
  }
)

// Method to compare password
User.prototype.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password)
}

User.prototype.hashPassword = function (password) {
  const salt = bcrypt.genSaltSync(10)
  return bcrypt.hashSync(password, salt)
}

module.exports = User
