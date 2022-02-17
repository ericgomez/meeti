const Group = require('../models/groups')
const Meeti = require('../models/meeti')

const adminPanel = async (req, res) => {
  const groupPromise = Group.findAll({ where: { userId: req.user.id } })
  const meetiPromise = Meeti.findAll({ where: { userId: req.user.id } })

  const [groups, meeti] = await Promise.all([groupPromise, meetiPromise])

  res.render('admin/index', {
    title: 'Admin Panel',
    groups,
    meeti
  })
}

module.exports = {
  adminPanel
}
