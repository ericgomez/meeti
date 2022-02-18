const { body, validationResult } = require('express-validator')

const validateFieldsGroup = async req => {
  const rules = [
    body('name')
      .trim()
      .escape(),
    body('url')
      .trim()
      .escape()
  ]

  await Promise.all(rules.map(validation => validation.run(req)))
}

const validateFieldsUser = async req => {
  const rules = [
    body('confirm-password')
      .notEmpty()
      .withMessage('Confirm password is required'),
    body('confirm-password')
      .equals(req.body.password)
      .withMessage('Confirm password must be the same as password')
  ]

  await Promise.all(rules.map(validation => validation.run(req)))

  const errors = validationResult(req)

  return errors
}

module.exports = {
  validateFieldsGroup,
  validateFieldsUser
}
