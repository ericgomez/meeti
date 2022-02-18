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
  if (!meeti.limit) {
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
    title: 'Edit Meeti : ${meeti.title}`,',
    meeti,
    groups
  })
}

const editMeeti = async (req, res, next) => {
  const meeti = await Meeti.findOne({
    where: { id: req.params.id, userId: req.user.id }
  })

  if (!meeti) {
    req.flash('error', 'Meeti not found')
    res.redirect('/admin')
    return next()
  }

  const {
    title,
    guest,
    limit,
    description,
    date,
    time,
    address,
    city,
    state,
    country,
    lat,
    lng,
    groupId
  } = req.body

  meeti.title = title
  meeti.guest = guest
  meeti.limit = limit
  meeti.description = description
  meeti.date = date
  meeti.time = time
  meeti.address = address
  meeti.city = city
  meeti.state = state
  meeti.country = country
  meeti.groupId = groupId

  const point = {
    type: 'Point',
    coordinates: [parseFloat(lng), parseFloat(lat)]
  }

  meeti.location = point

  try {
    await meeti.save()

    req.flash('success', 'Meeti edited successfully')
    res.redirect('/admin')
  } catch (error) {
    console.log(error)
    // get only the errors message from Sequelize
    const errorsSequelize = error.errors.map(err => err.message)

    req.flash('error', errorsSequelize)
    res.redirect('/edit-meeti')
  }
}

const formDeleteMeeti = async (req, res, next) => {
  const meeti = await Meeti.findOne({
    where: { id: req.params.id, userId: req.user.id }
  })

  if (!meeti) {
    req.flash('error', 'Meeti not found')
    res.redirect('/admin')
    return next()
  }

  res.render('meeti/delete', {
    title: `Delete Meeti : ${meeti.title}`,
    meeti
  })
}

module.exports = {
  formNewMeeti,
  newMeeti,
  formEditMeeti,
  editMeeti,
  formDeleteMeeti
}
