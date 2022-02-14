const multer = require('multer')
const { nanoid } = require('nanoid')

const configMulter = {
  limits: {
    fileSize: 2 * 1024 * 1024
  },
  storage: multer.diskStorage({
    destination: (req, file, next) => {
      next(null, './public/uploads/groups/')
    },
    filename: (req, file, next) => {
      const extension = file.mimetype.split('/')[1]

      // generate a unique name
      next(null, `${nanoid()}.${extension}`)
    }
  }),
  fileFilter: (req, file, next) => {
    // only images
    if (file.mimetype !== 'image/jpeg' || file.mimetype !== 'image/png') {
      return next(new Error('Only images are allowed'), false)
    }

    next(null, true)
  }
}

module.exports = multer(configMulter)
