const upload = require("../../functions/UploadImage");
const middlewares = require("../../middlewares");
const Controller = require('../../controllers');
const apiString = require('../../constants/api');
const { subStr } = require("../../functions/globalFunc");

module.exports = app => { 
  app.get(apiString.findOneEbook, Controller.ebooks.findOneEbook);//, middlewares.auth.accessPermission(subStr(apiString.findOneEbook)) 
  
  app.get(apiString.findManyEbook, middlewares.auth.accessPermission(subStr(apiString.findManyEbook)) , Controller.ebooks.findManyEbook);
  
  app.get(apiString.findEbookSubscribe, middlewares.auth.accessPermission(subStr(apiString.findEbookSubscribe)) , Controller.ebooks.findManyByUser);

  app.get(apiString.findEbookHistory, middlewares.auth.accessPermission(subStr(apiString.findEbookHistory)) , Controller.ebooks.findManyByUser);

  app.post(apiString.searchEbook, Controller.ebooks.searchEbook);
  
  app.put(apiString.updateOneEbook, upload.single("images"), middlewares.auth.accessPermission(subStr(apiString.updateOneEbook)) , Controller.ebooks.updateOneEbook);
  
  app.post(apiString.insertOneEbook, upload.single("images"), middlewares.auth.accessPermission(subStr(apiString.insertOneEbook)), Controller.ebooks.insertOneEbook);
  
  app.post(apiString.insertManyEbook, middlewares.auth.accessPermission(subStr(apiString.insertManyEbook)) , Controller.ebooks.insertManyEbook);
  
  app.delete(apiString.deleteOneEbook, middlewares.auth.accessPermission(subStr(apiString.deleteOneEbook)) , Controller.ebooks.deleteOneEbook);
  
  app.delete(apiString.deleteManyEbook, middlewares.auth.accessPermission(subStr(apiString.deleteManyEbook)) , Controller.ebooks.deleteManyEbook);
  
  app.delete(apiString.removeOneEbook, middlewares.auth.accessPermission(subStr(apiString.removeOneEbook)) , Controller.ebooks.removeOneEbook);
  
  app.delete(apiString.removeManyEbook, middlewares.auth.accessPermission(subStr(apiString.removeManyEbook)) , Controller.ebooks.removeManyEbook);
  
}





