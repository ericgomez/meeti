const { Op } = require('sequelize')
const moment = require('moment')

const Category = require('../models/categories')
const User = require('../models/users')
const Group = require('../models/groups')

const home = async (req, res) => {
  const categoriesPromise = Category.findAll()
  const meetisPromise = Meeti.findAll({
    attributes: ['title', 'date', 'time', 'slug'], // returns only the title, date, time and slug
    where: {
      date: {
        [Op.gte]: moment().format('YYYY-MM-DD')
      }
    },
    limit: 3,
    order: [['date', 'ASC']],
    // join the users and groups tables - includes
    include: [
      {
        model: User,
        attributes: ['name', 'image']
      },
      {
        model: Group,
        attributes: ['image']
      }
    ]
  })

  const [categories, meetis] = await Promise.all([
    categoriesPromise,
    meetisPromise
  ])

  res.render('home', {
    title: 'Home',
    categories,
    meetis
  })
}

module.exports = {
  home
}
