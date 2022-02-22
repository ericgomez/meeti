const { Op } = require('sequelize')
const moment = require('moment')

const Meeti = require('../../models/meeti')
const Group = require('../../models/groups')
const User = require('../../models/users')

const searchResults = async (req, res) => {
  const { category, title, city, country } = req.query

  const meetis = await Meeti.findAll({})
}

module.exports = { searchResults }
