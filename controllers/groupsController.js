const formNewGroup = (req, res) => {
  res.render('groups/new-group', {
    title: 'New Group'
  })
}

module.exports = {
  formNewGroup
}
