const { Op } = require('sequelize')
const moment = require('moment')

const Group = require('../models/groups')
const Meeti = require('../models/meeti')

const adminPanel = async (req, res) => {
  const groupPromise = Group.findAll({ where: { userId: req.user.id } })
  const nextMeetiPromise = Meeti.findAll({
    where: {
      userId: req.user.id,
      date: {
        [Op.gte]: moment().format('YYYY-MM-DD')
      }
    }
  })
  const pastMeetiPromise = Meeti.findAll({
    where: {
      userId: req.user.id,
      date: {
        [Op.lt]: moment().format('YYYY-MM-DD')
      }
    }
  })

  const [groups, nextMeeti, pastMeeti] = await Promise.all([
    groupPromise,
    nextMeetiPromise,
    pastMeetiPromise
  ])

  res.render('admin/index', {
    title: 'Admin Panel',
    groups,
    nextMeeti,
    pastMeeti,
    moment
  })
}

module.exports = {
  adminPanel
}
