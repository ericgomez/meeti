const Category = require('../models/categories')

const home = async (req, res) => {
  const categoriesPromise = Category.findAll()

  const [categories] = await Promise.all([categoriesPromise])

  res.render('home', {
    title: 'Home',
    categories
  })
}

module.exports = {
  home
}
