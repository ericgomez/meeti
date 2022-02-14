const adminPanel = (req, res) => {
  res.render('admin/index', {
    title: 'Admin Panel'
  })
}

module.exports = {
  adminPanel
}
