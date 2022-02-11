const formSignup = (req, res) => {
  res.render('signup', {
    title: 'Signup'
  })
}

module.exports = {
  formSignup
}
