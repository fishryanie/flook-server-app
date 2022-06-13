const middlewares = require('../../middlewares')
const Controller = require('../../controllers')


module.exports = app => {
  
  app.get('/api/movie-management/getMovie', 
  Controller.movie.FindMovieController)
 
  app.get('/api/movie-management/listFavoriteByUserId',[  ], Controller.movie.FindListFavoriteByUserId) 

  app.delete('/api/movie-management/deleteAllMovie',[   ], Controller.movie.DeleteAllMovieController)

  app.delete('/api/movie-management/deleteMovie/:id',[

  ], Controller.movie.DeleteMovieController)

  app.put('/api/movie-management/updateMovie',[

  ], Controller.movie.UpdateMovieController)

  app.post('/api/movie-management/addMovie',[

  ], Controller.movie.AddMovieController)
  

} 



