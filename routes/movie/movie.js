const upload = require("../../functions/UploadImage");
const middlewares = require("../../middlewares");
const Controller = require('../../controllers');
const apiString = require('../../constants/api');
const { subStr } = require("../../functions/globalFunc");

module.exports = app => { 
  app.get(apiString.findOneMovie, middlewares.auth.accessPermission(subStr(apiString.findOneMovie)) , Controller.movie.findOneMovie);
  
  app.get(apiString.findManyMovie, middlewares.auth.accessPermission(subStr(apiString.findManyMovie)) , Controller.movie.findManyMovie);
  
  app.get(apiString.searchMovie, middlewares.auth.accessPermission(subStr(apiString.searchMovie)) , Controller.movie.searchMovie);
  
  app.put(apiString.updateOneMovie, middlewares.auth.accessPermission(subStr(apiString.updateOneMovie)) , Controller.movie.updateOneMovie);
  
  app.post(apiString.insertOneMovie, middlewares.auth.accessPermission(subStr(apiString.insertOneMovie)) , Controller.movie.insertOneMovie);
  
  app.post(apiString.insertManyMovie, middlewares.auth.accessPermission(subStr(apiString.insertManyMovie)) , Controller.movie.insertManyMovie);
  
  app.delete(apiString.deleteOneMovie, middlewares.auth.accessPermission(subStr(apiString.deleteOneMovie)) , Controller.movie.deleteOneMovie);
  
  app.delete(apiString.deleteManyMovie, middlewares.auth.accessPermission(subStr(apiString.deleteManyMovie)) , Controller.movie.deleteManyMovie);
  
  app.delete(apiString.removeOneMovie, middlewares.auth.accessPermission(subStr(apiString.removeOneMovie)) , Controller.movie.removeOneMovie);
  
  app.delete(apiString.removeManyMovie, middlewares.auth.accessPermission(subStr(apiString.removeManyMovie)) , Controller.movie.removeManyMovie);
  
}





