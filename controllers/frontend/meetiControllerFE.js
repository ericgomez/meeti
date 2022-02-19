const moment = require('moment')

const Meeti = require('../../models/meeti')
const Group = require('../../models/groups')
const User = require('../../models/users')

const getMeeti = async (req, res) => {
  const meeti = await Meeti.findOne({
    where: { slug: req.params.slug },
    // join the users and groups tables - include
    include: [
      { model: Group },
      { model: User, attributes: ['id', 'name', 'image'] }
    ]
  })

  if (!meeti) {
    return res.redirect('/')
  }

  res.render('frontend/meeti', {
    title: meeti.title,
    meeti,
    moment
  })
}

const confirmAssistance = async (req, res) => {
  console.log('confirmAssistance')
}

module.exports = { getMeeti, confirmAssistance }
