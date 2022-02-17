const Sequelize = require('sequelize')
const { v4: uuid } = require('uuid')
const nanoid = require('nanoid')
const slug = require('slug')

const db = require('../config/db')
const User = require('./users')
const Group = require('./groups')

const Meeti = db.define(
  'meeti',
  {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: () => uuid()
    },
    title: {
      type: Sequelize.STRING(60),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Title cannot be empty'
        }
      }
    },
    slug: Sequelize.STRING,
    guest: Sequelize.STRING(60),
    limit: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Description cannot be empty'
        }
      }
    },
    date: {
      type: Sequelize.DATEONLY,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Date cannot be empty'
        }
      }
    },
    time: {
      type: Sequelize.TIME,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Time cannot be empty'
        }
      }
    },
    address: {
      type: Sequelize.STRING(80),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Address cannot be empty'
        }
      }
    },
    city: {
      type: Sequelize.STRING(60),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'City cannot be empty'
        }
      }
    },
    state: {
      type: Sequelize.STRING(60),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'State cannot be empty'
        }
      }
    },
    country: {
      type: Sequelize.STRING(60),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Country cannot be empty'
        }
      }
    },
    location: {
      type: Sequelize.GEOMETRY('POINT', 4326), // save longitude and latitude in only one column
      allowNull: false
    },
    interested: {
      type: Sequelize.ARRAY(Sequelize.INTEGER),
      defaultValue: []
    }
  },
  {
    hooks: {
      beforeCreate: meeti => {
        const url = slug(meeti.title).toLowerCase()
        meeti.slug = `${url}-${nanoid()}`
      }
    }
  }
)

Meeti.belongsTo(User)
Meeti.belongsTo(Group)

module.exports = Meeti
