const upload = require("../../functions/UploadImage");
const middlewares = require("../../middlewares");
const Controller = require('../../controllers');
const apiString = require('../../constants/routes');
const subStr = require('../../functions/subString')

module.exports = app => { 
  app.get(apiString.findOneAuthor, middlewares.auth.accessPermission(subStr(apiString.findOneAuthor)) , Controller.author.findOneAuthor);
  
  app.get(apiString.findManyAuthor, middlewares.auth.accessPermission(subStr(apiString.findManyAuthor)) , Controller.author.findManyAuthor);
  
  app.get(apiString.searchAuthor, middlewares.auth.accessPermission(subStr(apiString.searchAuthor)) , Controller.author.searchAuthor);
  
  app.put(apiString.updateOneAuthor, middlewares.auth.accessPermission(subStr(apiString.updateOneAuthor)) , Controller.author.updateOneAuthor);
  
  app.post(apiString.insertOneAuthor, middlewares.auth.accessPermission(subStr(apiString.insertOneAuthor)) , Controller.author.insertOneAuthor);
  
  app.post(apiString.insertManyAuthor, middlewares.auth.accessPermission(subStr(apiString.insertManyAuthor)) , Controller.author.insertManyAuthor);
  
  app.delete(apiString.deleteOneAuthor, middlewares.auth.accessPermission(subStr(apiString.deleteOneAuthor)) , Controller.author.deleteOneAuthor);
  
  app.delete(apiString.deleteManyAuthor, middlewares.auth.accessPermission(subStr(apiString.deleteManyAuthor)) , Controller.author.deleteManyAuthor);
  
  app.delete(apiString.removeOneAuthor, middlewares.auth.accessPermission(subStr(apiString.removeOneAuthor)) , Controller.author.removeOneAuthor);
  
  app.delete(apiString.removeManyAuthor, middlewares.auth.accessPermission(subStr(apiString.removeManyAuthor)) , Controller.author.removeManyAuthor);
  
}





