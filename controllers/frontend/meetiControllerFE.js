const { Op, fn, col, literal, where } = require('sequelize')
const moment = require('moment')

const Meeti = require('../../models/meeti')
const Group = require('../../models/groups')
const User = require('../../models/users')
const Comment = require('../../models/comments')

const getMeeti = async (req, res) => {
  const meeti = await Meeti.findOne({
    where: { slug: req.params.slug },
    // join the users and groups tables - include
    include: [
      { model: Group },
      { model: User, attributes: ['id', 'name', 'image'] }
    ]
  })

  if (!meeti) {
    return res.redirect('/')
  }

  const comments = await Comment.findAll({
    where: { meetiId: meeti.id },
    include: [{ model: User, attributes: ['id', 'name', 'image'] }]
  })

  // get meetis near to the current meeti
  const location = literal(
    `ST_GeomFromText('POINT(${meeti.location.coordinates[0]} ${meeti.location.coordinates[1]})')`
  )

  // ST_DistanceSphere returns the distance in meters
  const distance = fn('ST_DistanceSphere', col('location'), location)

  // found meetis near to the current meeti
  const meetisNear = await Meeti.findAll({
    where: where(distance, { [Op.lte]: 2000 }), // 2000 meters
    include: [
      { model: Group },
      { model: User, attributes: ['id', 'name', 'image'] }
    ],
    order: distance,
    offset: 1, // skip the current meeti
    limit: 3
  })

  res.render('frontend/meeti', {
    title: meeti.title,
    meeti,
    comments,
    meetisNear,
    moment
  })
}

const confirmAssistance = async (req, res) => {
  const { action } = req.body

  if (action === 'confirm') {
    Meeti.update(
      {
        interested: fn('array_append', col('interested'), req.user.id)
      },
      {
        where: { slug: req.params.slug }
      }
    )

    res.send('Assistance confirmed')
  } else {
    Meeti.update(
      {
        interested: fn('array_remove', col('interested'), req.user.id)
      },
      {
        where: { slug: req.params.slug }
      }
    )

    res.send('Assistance canceled')
  }
}

const showAssistants = async (req, res) => {
  // get id of interested in the meeti
  const { interested } = await Meeti.findOne({
    where: { slug: req.params.slug },
    attributes: ['interested']
  })

  if (!interested) {
    return res.redirect('back')
  }

  const assistants = await User.findAll({
    attributes: ['name', 'image'],
    where: {
      id: interested
    }
  })

  res.render('frontend/assistants', {
    title: 'Assistants',
    assistants
  })
}

module.exports = { getMeeti, confirmAssistance, showAssistants }
