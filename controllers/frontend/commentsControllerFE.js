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
  const { commentId } = req.body

  try {
    const comment = await Comment.findOne({ where: { id: commentId } })

    if (!comment) {
      res.send('The comment does not exist')
      return next()
    }

    // req.user.id is the id of the logged user by passport
    if (comment.userId !== req.user.id) {
      res.send('You are not authorized to delete this comment')
      return next()
    }

    await Comment.destroy({
      where: {
        id: commentId
      }
    })

    res.redirect('back')
  } catch (error) {
    next(error)
  }
}

module.exports = {
  addComment,
  deleteComment
}
