const moment = require('moment')

const Group = require('../../models/groups')
const Meeti = require('../../models/meeti')
const Category = require('../../models/categories')
const User = require('../../models/users')

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

const showCategory = async (req, res, next) => {
  const category = await Category.findOne({
    attributes: ['id', 'name'],
    where: { slug: req.params.category }
  })

  const meetis = await Meeti.findAll({
    include: [
      {
        model: Group,
        where: { categoryId: category.id }
      },

      {
        model: User
      }
    ]
  })

  res.render('frontend/groups/category', {
    title: `Groups by category : ${category.name}`,
    meetis,
    moment
  })
}

module.exports = { getGroup, showCategory }
