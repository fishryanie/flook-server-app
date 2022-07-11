const upload = require("../../functions/UploadImage");
const middlewares = require("../../middlewares");
const Controller = require('../../controllers');
const apiString = require('../../constants/routes');
const subStr = require('../../functions/subString')

module.exports = app => { 
  app.get(apiString.findOneEbook, middlewares.auth.accessPermission(subStr(apiString.findOneEbook)) , Controller.ebooks.findOneEbook);
  
  app.get(apiString.findManyEbook, middlewares.auth.accessPermission(subStr(apiString.findManyEbook)) , Controller.ebooks.findManyEbook);
  
  app.get(apiString.searchEbook, middlewares.auth.accessPermission(subStr(apiString.searchEbook)) , Controller.ebooks.searchEbook);
  
  app.put(apiString.updateOneEbook, middlewares.auth.accessPermission(subStr(apiString.updateOneEbook)) , Controller.ebooks.updateOneEbook);
  
  app.post(apiString.insertOneEbook, middlewares.auth.accessPermission(subStr(apiString.insertOneEbook)) , Controller.ebooks.insertOneEbook);
  
  app.post(apiString.insertManyEbook, middlewares.auth.accessPermission(subStr(apiString.insertManyEbook)) , Controller.ebooks.insertManyEbook);
  
  app.delete(apiString.deleteOneEbook, middlewares.auth.accessPermission(subStr(apiString.deleteOneEbook)) , Controller.ebooks.deleteOneEbook);
  
  app.delete(apiString.deleteManyEbook, middlewares.auth.accessPermission(subStr(apiString.deleteManyEbook)) , Controller.ebooks.deleteManyEbook);
  
  app.delete(apiString.removeOneEbook, middlewares.auth.accessPermission(subStr(apiString.removeOneEbook)) , Controller.ebooks.removeOneEbook);
  
  app.delete(apiString.removeManyEbook, middlewares.auth.accessPermission(subStr(apiString.removeManyEbook)) , Controller.ebooks.removeManyEbook);
  
}





