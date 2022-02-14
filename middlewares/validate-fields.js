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

  // const errors = validationResult(req)

  // return errors
}

module.exports = {
  validateFieldsGroup
}
