const middlewares = require('../middlewares')
const Controller = require('../controllers')


module.exports = app => {
  
  app.get('/api/movie-management/getMovie', 
  Controller.movie.FindMovieController)
 
  app.get('/api/movie-management/listFavoriteByUserId',[
    middlewares.auth.VerifyToken
  ], Controller.movie.FindListFavoriteByUserId) 

  app.delete('/api/movie-management/deleteAllMovie',[ 
    middlewares.auth.VerifyToken,
    middlewares.auth.CheckAuth
  ], Controller.movie.DeleteAllMovieController)

  app.delete('/api/movie-management/deleteMovie/:id',[
    middlewares.auth.VerifyToken,
    middlewares.auth.CheckAuth,
    middlewares.auth.CheckPermission
  ], Controller.movie.DeleteMovieController)

  app.put('/api/movie-management/updateMovie',[
    middlewares.auth.VerifyToken,
    middlewares.auth.CheckAuth,
    middlewares.auth.CheckPermission
  ], Controller.movie.UpdateMovieController)

  app.post('/api/movie-management/addMovie',[
    middlewares.auth.VerifyToken,
    middlewares.auth.CheckAuth,
    middlewares.auth.CheckPermission
  ], Controller.movie.AddMovieController)
  

} 



