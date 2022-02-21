const User = require('../../models/users')
const Group = require('../../models/groups')

const getUser = async (req, res, next) => {
  const userPromise = User.findOne({
    attributes: ['id', 'name', 'description', 'image'],
    where: { id: req.params.id }
  })

  const groupsPromise = Group.findAll({
    attributes: ['id', 'name', 'description', 'image'],
    where: { userId: req.params.id }
  })

  const [user, groups] = await Promise.all([userPromise, groupsPromise])

  if (!user) {
    res.redirect('/')
    return next()
  }

  res.render('frontend/user', {
    title: `User Profile - ${user.name}`,
    user,
    groups
  })
}

module.exports = { getUser }
