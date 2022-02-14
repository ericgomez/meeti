const Sequelize = require('sequelize')
const { v4: uuid } = require('uuid')

const db = require('../config/db')
const User = require('./users')
const Category = require('./categories')

const Group = dn.define('group', {
  id: {
    type: Sequelize.UUID,
    primaryKey: true,
    defaultValue: () => uuid()
  },
  name: {
    type: Sequelize.STRING(60),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Group name cannot be empty'
      }
    }
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Group description cannot be empty'
      }
    }
  },
  url: Sequelize.TEXT,
  image: Sequelize.TEXT
})

Group.belongsTo(Category)
Group.belongsTo(User)

module.exports = Group
