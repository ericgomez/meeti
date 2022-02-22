const Comment = require('../../models/comments')

const addComment = async (req, res, next) => {
  const { id } = req.params
  const { comment } = req.body
  const { user } = req

  try {
    await Comment.create({
      comment,
      meetiId: id,
      userId: user.id
    })

    res.redirect('back')
  } catch (error) {
    next(error)
  }
}

module.exports = {
  addComment
}
