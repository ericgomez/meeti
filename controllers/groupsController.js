const fs = require('fs')

const Category = require('../models/categories')
const Group = require('../models/groups')
const { validateFieldsGroup } = require('../middlewares/validateFields')
const multer = require('../middlewares/fileUploadGroup')

// upload image
const uploadImageGroup = async (req, res, next) => {
  const upload = multer.single('image')

  upload(req, res, async error => {
    if (error) {
      if (error.code === 'LIMIT_FILE_SIZE') {
        req.flash('error', 'The file size is too big')
      } else if (error.hasOwnProperty('message')) {
        // access the error message directly of new Error
        req.flash('error', error.message)
      } else {
        req.flash('error', error.message)
      }
      // redirect to back
      return res.redirect('back')
    } else {
      next()
    }
  })
}

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

  // add only name of image
  if (req.file) {
    group.image = req.file.filename
  }

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

const formEditGroup = async (req, res) => {
  const groupPromise = Group.findByPk(req.params.groupId)
  const categoriesPromise = Category.findAll()

  const [group, categories] = await Promise.all([
    groupPromise,
    categoriesPromise
  ])

  res.render('groups/edit-group', {
    title: `Edit Group: ${group.name}`,
    group,
    categories
  })
}

const editGroup = async (req, res, next) => {
  // check if the user is the owner of the group
  const group = await Group.findOne({
    where: { id: req.params.groupId, userId: req.user.id }
  })

  if (!group) {
    req.flash('error', 'You are not the owner of this group')
    res.redirect('back')

    return next()
  }

  // sanitize fields
  await validateFieldsGroup(req)

  const { name, description, categoryId, url } = req.body

  group.name = name
  group.description = description
  group.categoryId = categoryId
  group.url = url

  // save in the database
  try {
    await group.save()

    req.flash('success', `Group ${group.name} was updated successfully`)
    res.redirect('/admin')
  } catch (error) {
    console.log(error)
    // get only the errors message from Sequelize
    const errorsSequelize = error.errors.map(err => err.message)

    req.flash('error', errorsSequelize)
    res.redirect('/edit-group')
  }
}

const formEditImage = async (req, res) => {
  const group = await Group.findByPk(req.params.groupId)

  res.render('groups/edit-image', {
    title: `Edit Image: ${group.name}`,
    group
  })
}

const editImage = async (req, res, next) => {
  // check if the user is the owner of the group
  const group = await Group.findOne({
    where: { id: req.params.groupId, userId: req.user.id }
  })

  if (!group) {
    req.flash('error', 'You are not the owner of this group')
    res.redirect('back')

    return next()
  }

  // check if a previous image exists and a new image exists
  if (req.file && group.image) {
    const pathImage = `./public/uploads/groups/${group.image}`

    // delete the previous image asynchronously
    // no required await because it is not a blocking operation
    fs.unlink(pathImage, error => {
      if (error) {
        console.log(error)
      }

      return
    })
  }

  // add only name of image
  if (req.file) {
    group.image = req.file.filename
  }

  try {
    await group.save()

    req.flash('success', `Image of ${group.name} was updated successfully`)
    res.redirect('/admin')
  } catch (error) {
    console.log(error)
    // get only the errors message from Sequelize
    const errorsSequelize = error.errors.map(err => err.message)

    req.flash('error', errorsSequelize)
    res.redirect('/edit-image')
  }
}

const formDeleteGroup = async (req, res, next) => {
  // check if the user is the owner of the group
  const group = await Group.findOne({
    where: { id: req.params.groupId, userId: req.user.id }
  })

  if (!group) {
    req.flash('error', 'Group not found')
    res.redirect('back')

    return next()
  }

  res.render('groups/delete-group', {
    title: `Delete Group: ${group.name}`,
    group
  })
}

const deleteGroup = async (req, res, next) => {
  // check if the user is the owner of the group
  const group = await Group.findOne({
    where: { id: req.params.groupId, userId: req.user.id }
  })

  if (!group) {
    req.flash('error', 'Group not found')
    res.redirect('back')

    return next()
  }

  // check if a image exists
  if (group.image) {
    const pathImage = `./public/uploads/groups/${group.image}`

    // delete the previous image asynchronously
    // no required await because it is not a blocking operation
    fs.unlink(pathImage, error => {
      if (error) {
        console.log(error)
      }

      return
    })
  }

  try {
    await group.destroy()

    req.flash('success', `Group ${group.name} was deleted successfully`)
    res.redirect('/admin')
  } catch (error) {
    console.log(error)
    // get only the errors message from Sequelize
    const errorsSequelize = error.errors.map(err => err.message)

    req.flash('error', errorsSequelize)
    res.redirect('/delete-group')
  }
}

module.exports = {
  formNewGroup,
  createGroup,
  uploadImageGroup,
  formEditGroup,
  editGroup,
  formEditImage,
  editImage,
  formDeleteGroup,
  deleteGroup
}
