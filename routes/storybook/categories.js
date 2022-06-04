const middlewares = require('../../middlewares')
const Controller = require('../../controllers')

module.exports = app => {

  app.get('/api/categories-management/getCategories',
    Controller.categories.findCategories)

  app.post('/api/categories-management/addCategories',
    Controller.categories.addCategories)

  app.delete('/api/categories-management/deleteCategories/:id',
    Controller.categories.deleteCategories)

  app.put('/api/categories-management/updateCategories/:id',
    Controller.categories.updateCategories)

}