const Comment = require('../../models/comments')
const Meeti = require('../../models/meeti')

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
      res.status(404).send('The comment does not exist')
      return next()
    }

    // get creator of the meeti
    const meeti = await Meeti.findOne({ where: { id: comment.meetiId } })

    // req.user.id is the id of the logged user by passport
    console.log(comment.userId, req.user.id, meeti.userId, req.user.id)

    // check if the logged user is the creator of the comment
    if (comment.userId !== req.user.id) {
      res.status(401).send('You are not authorized to delete this comment')
      return next()
    }

    //check if the logged user is the creator of the meeti
    if (meeti.userId !== req.user.id) {
      res.status(401).send('You are not authorized to delete this comment')
      return next()
    }

    await Comment.destroy({
      where: {
        id: commentId
      }
    })

    res.status(200).send('Comment deleted')
    return next()
  } catch (error) {
    res.status(404).send('The comment does not exist')
    next(error)
  }
}

module.exports = {
  addComment,
  deleteComment
}
