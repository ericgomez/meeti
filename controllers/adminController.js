const Group = require('../models/groups')

const adminPanel = async (req, res) => {
  const groups = await Group.findAll({ where: { userId: req.user.id } })

  res.render('admin/index', {
    title: 'Admin Panel',
    groups
  })
}

module.exports = {
  adminPanel
}
