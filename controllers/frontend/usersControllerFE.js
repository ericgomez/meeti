const User = require('../../models/users')
const Group = require('../../models/groups')

const getUser = async (req, res, next) => {
  const userPromise = User.findOne({
    where: { id: req.params.id },
    attributes: ['id', 'name', 'email', 'image']
  })

  const groupsPromise = Group.findAll({
    where: { userId: req.params.id },
    attributes: ['id', 'name', 'slug']
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
