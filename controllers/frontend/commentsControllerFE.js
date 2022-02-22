const Comment = require('../../models/comments')

const addComment = async (req, res, next) => {
  const { id } = req.params
  const { text } = req.body
  const { user } = req

  try {
    await Comment.create({
      text,
      meetiId: id,
      userId: user.id
    })

    res.redirect('back')
  } catch (error) {
    next(error)
  }
}

const deleteComment = async (req, res, next) => {
  res.send('delete comment')
}

module.exports = {
  addComment,
  deleteComment
}
