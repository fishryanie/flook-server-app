const middlewares = require('../../middlewares')
const Controller = require('../../controllers')

module.exports = app => {

  app.get('/api/genre-management/getGenre', 
  Controller.genre.findGenre)

  app.post('/api/genre-management/addGenre', 
  Controller.genre.addGenre)

  app.delete('/api/genre-management/deleteGenre/:id', 
  Controller.genre.deleteGenre)

  app.put('/api/genre-management/updateGenre', 
  Controller.genre.updateGenre)
  
}