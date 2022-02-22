const { body } = require('express-validator')

const sanitizeFieldsMeeti = async (req, res, next) => {
  const rules = [
    body('title')
      .trim()
      .escape(),
    body('guest')
      .trim()
      .escape(),
    body('limit')
      .trim()
      .escape(),
    body('date')
      .trim()
      .escape(),
    body('time')
      .trim()
      .escape(),
    body('address')
      .trim()
      .escape(),
    body('city')
      .trim()
      .escape(),
    body('country')
      .trim()
      .escape(),
    body('lat')
      .trim()
      .escape(),
    body('lng')
      .trim()
      .escape(),
    body('groupId')
      .trim()
      .escape()
  ]

  await Promise.all(rules.map(validation => validation.run(req)))

  next()
}

const sanitizeFieldsComment = async (req, res, next) => {
  const rules = [
    body('comment')
      .trim()
      .escape()
  ]

  await Promise.all(rules.map(validation => validation.run(req)))

  next()
}

const sanitizeFieldsProfile = async (req, res, next) => {
  const rules = [
    body('name')
      .trim()
      .escape(),
    body('email')
      .trim()
      .escape()
  ]

  await Promise.all(rules.map(validation => validation.run(req)))

  next()
}

module.exports = {
  sanitizeFieldsMeeti,
  sanitizeFieldsComment,
  sanitizeFieldsProfile
}
