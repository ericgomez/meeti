const { body, validationResult } = require('express-validator')

const Category = require('../models/categories')
const Group = require('../models/groups')
const { validateFieldsGroup } = require('../middlewares/validate-fields')

const formNewGroup = async (req, res) => {
  const categories = await Category.findAll()

  res.render('groups/new-group', {
    title: 'New Group',
    categories
  })
}

const createGroup = async (req, res) => {
  // sanitize fields
  await validateFieldsGroup(req)

  const group = req.body

  // add user id
  group.userId = req.user.id
  group.categoryId = req.body.category

  try {
    const newGroup = await Group.create(group)

    req.flash('success', `Group ${newGroup.name} was created successfully`)
    res.redirect('/admin')
  } catch (error) {
    console.log(error)
    // get only the errors message from Sequelize
    const errorsSequelize = error.errors.map(err => err.message)

    req.flash('error', errorsSequelize)
    res.redirect('/new-group')
  }
}

module.exports = {
  formNewGroup,
  createGroup
}
