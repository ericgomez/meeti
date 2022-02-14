const multer = require('multer')
const { nanoid } = require('nanoid')

const Category = require('../models/categories')
const Group = require('../models/groups')
const { validateFieldsGroup } = require('../middlewares/validate-fields')

const storage = multer.diskStorage({
  destination: function (req, file, next) {
    next(null, './public/uploads/groups/')
  },
  filename: function (req, file, next) {
    const extension = file.mimetype.split('/')[1]

    // generate a unique name
    next(null, `${nanoid()}.${extension}`)
  }
})

const upload = multer({ storage }).single('image')

// upload image
const uploadImage = async (req, res, next) => {
  upload(req, res, async error => {
    if (error) {
      console.log(error)

      req.flash('error', error.message)
      res.redirect('/new-group')
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
  group.image = req.file.filename

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
  createGroup,
  uploadImage
}
