const Group = require('../models/groups')
const Meeti = require('../models/meeti')

const formNewMeeti = async (req, res) => {
  const groups = await Group.findAll({ where: { userId: req.user.id } })

  res.render('meeti/new', {
    title: 'New Meeti',
    groups
  })
}

const newMeeti = async (req, res) => {
  const meeti = req.body

  // add userId of passport
  meeti.userId = req.user.id

  const point = {
    type: 'Point',
    coordinates: [parseFloat(meeti.lng), parseFloat(meeti.lat)]
  }

  meeti.location = point

  // not required because the model already has a default value 0
  if (meeti.limit) {
    meeti.limit = 0
  }

  try {
    await Meeti.create(meeti)

    req.flash('success', 'Meeti created successfully')
    res.redirect('/admin')
  } catch (error) {
    console.log(error)
    // get only the errors message from Sequelize
    const errorsSequelize = error.errors.map(err => err.message)

    req.flash('error', errorsSequelize)
    res.redirect('/new-meeti')
  }
}

const formEditMeeti = async (req, res, next) => {
  const meetiPromise = Meeti.findByPk(req.params.id)
  const groupPromise = Group.findAll({ where: { userId: req.user.id } })

  const [meeti, groups] = await Promise.all([meetiPromise, groupPromise])

  if (!meeti || !groups) {
    req.flash('error', 'Meeti not found')
    res.redirect('/admin')
    return next()
  }

  res.render('meeti/edit', {
    title: 'Edit Meeti',
    meeti,
    groups
  })
}

module.exports = {
  formNewMeeti,
  newMeeti,
  formEditMeeti
}
