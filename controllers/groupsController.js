const Category = require('../models/categories')
const Group = require('../models/groups')

const formNewGroup = async (req, res) => {
  const categories = await Category.findAll()

  res.render('groups/new-group', {
    title: 'New Group',
    categories
  })
}

const createGroup = async (req, res) => {
  const { name, description, category, image, url } = req.body

  try {
    const group = await Group.create({
      name,
      description,
      category,
      image,
      url
    })

    req.flash('success', `Group ${group.name} was created successfully`)
    res.redirect('/admin')
  } catch (error) {
    console.log(error)

    req.flash('error', error)
    res.redirect('/new-group')
  }
}

module.exports = {
  formNewGroup,
  createGroup
}
