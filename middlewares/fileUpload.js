const multer = require('multer')
const { nanoid } = require('nanoid')

const configMulter = {
  limits: {
    fileSize: 2 * 1024 * 1024
  },
  storage: multer.diskStorage({
    destination: function (req, file, next) {
      next(null, './public/uploads/groups/')
    },
    filename: function (req, file, next) {
      const extension = file.mimetype.split('/')[1]

      // generate a unique name
      next(null, `${nanoid()}.${extension}`)
    }
  })
}

module.exports = multer(configMulter)
