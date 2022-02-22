const { Op } = require('sequelize')
const moment = require('moment')

const Meeti = require('../../models/meeti')
const Group = require('../../models/groups')
const User = require('../../models/users')

const searchResults = async (req, res) => {
  const { category, title, city, country } = req.query

  const query =
    category === '' ? '' : `where: { categoryId: { [Op.eq]: ${category} } }`
  console.log(query)

  const meetis = await Meeti.findAll({
    where: {
      title: { [Op.iLike]: `%${title}%` }, // Op.iLike: case insensitive
      city: { [Op.iLike]: `%${city}%` }, // Op.iLike: case insensitive
      country: { [Op.iLike]: `%${country}%` } // Op.iLike: case insensitive
    },
    include: [
      {
        model: Group,
        query
      },
      {
        model: User,
        attributes: ['id', 'name', 'image']
      }
    ]
  })

  res.render('frontend/search', {
    title: 'Buscar',
    meetis,
    moment
  })
}

module.exports = { searchResults }
