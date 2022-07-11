const upload = require("../../functions/UploadImage");
const middlewares = require("../../middlewares");
const Controller = require('../../controllers');
const apiString = require('../../constants/api');
const { subStr } = require("../../functions/globalFunc");

module.exports = app => { 
  app.get(apiString.findOneGenre, middlewares.auth.accessPermission(subStr(apiString.findOneGenre)) , Controller.genre.findOneGenre);
  
  app.get(apiString.findManyGenre, middlewares.auth.accessPermission(subStr(apiString.findManyGenre)) , Controller.genre.findManyGenre);
  
  app.get(apiString.searchGenre, middlewares.auth.accessPermission(subStr(apiString.searchGenre)) , Controller.genre.searchGenre);
  
  app.put(apiString.updateOneGenre, middlewares.auth.accessPermission(subStr(apiString.updateOneGenre)) , Controller.genre.updateOneGenre);
  
  app.post(apiString.insertOneGenre, middlewares.auth.accessPermission(subStr(apiString.insertOneGenre)) , Controller.genre.insertOneGenre);
  
  app.post(apiString.insertManyGenre, middlewares.auth.accessPermission(subStr(apiString.insertManyGenre)) , Controller.genre.insertManyGenre);
  
  app.delete(apiString.deleteOneGenre, middlewares.auth.accessPermission(subStr(apiString.deleteOneGenre)) , Controller.genre.deleteOneGenre);
  
  app.delete(apiString.deleteManyGenre, middlewares.auth.accessPermission(subStr(apiString.deleteManyGenre)) , Controller.genre.deleteManyGenre);
  
  app.delete(apiString.removeOneGenre, middlewares.auth.accessPermission(subStr(apiString.removeOneGenre)) , Controller.genre.removeOneGenre);
  
  app.delete(apiString.removeManyGenre, middlewares.auth.accessPermission(subStr(apiString.removeManyGenre)) , Controller.genre.removeManyGenre);
  
}





