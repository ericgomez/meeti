const Category = require('../models/categories')
const Group = require('../models/groups')
const { validateFieldsGroup } = require('../middlewares/validateFields')
const multer = require('../middlewares/fileUpload')

// upload image
const uploadImage = async (req, res, next) => {
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

module.exports = {
  formNewGroup,
  createGroup,
  uploadImage,
  formEditGroup
}
