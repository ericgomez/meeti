const moment = require('moment')

const Group = require('../../models/groups')
const Meeti = require('../../models/meeti')

const getGroup = async (req, res, next) => {
  const groupPromise = Group.findOne({ where: { id: req.params.id } })
  const meetisPromise = Meeti.findAll({
    where: { groupId: req.params.id },
    order: [['date', 'ASC']]
  })

  const [group, meetis] = await Promise.all([groupPromise, meetisPromise])

  if (!group) {
    res.redirect('/')
    return next()
  }

  res.render('frontend/groups/show', {
    title: `Group info : ${group.name}`,
    group,
    meetis,
    moment
  })
}

module.exports = { getGroup }
