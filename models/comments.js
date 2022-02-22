const Sequelize = require('sequelize')
const { v4: uuid } = require('uuid')

const db = require('../config/db')
const User = require('./users')
const Meeti = require('./meeti')

const Comment = db.define(
  'comment',
  {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: () => uuid()
    },
    comment: {
      type: Sequelize.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Comment cannot be empty'
        }
      }
    }
  },
  {
    timestamps: false
  }
)

Comment.belongsTo(User)
Comment.belongsTo(Meeti)

module.exports = Comment
