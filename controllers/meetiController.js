const Group = require('../models/groups')

const formNewMeeti = async (req, res) => {
  const groups = await Group.findAll({ where: { userId: req.user.id } })

  res.render('meeti/new', {
    title: 'New Meeti',
    groups
  })
}

module.exports = {
  formNewMeeti
}
