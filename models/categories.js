const { Sequelize } = require('sequelize')

const dn = require('../config/db')

const Category = dn.define(
  'category',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: Sequelize.STRING(60),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Category name cannot be empty'
        }
      }
    },
    slug: Sequelize.TEXT
  },
  {
    // don't add the timestamp attributes (updatedAt, createdAt)
    timestamps: false
  }
)

module.exports = Category
