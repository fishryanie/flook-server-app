const upload = require("../../functions/UploadImage");
const middlewares = require("../../middlewares");
const Controller = require('../../controllers');
const apiString = require('../../constants/api');
const { subStr } = require("../../functions/globalFunc");

module.exports = app => { 
  app.get(apiString.findOneComment, middlewares.auth.accessPermission(subStr(apiString.findOneComment)) , Controller.comment.findOneComment);
  
  app.get(apiString.findManyComment, middlewares.auth.accessPermission(subStr(apiString.findManyComment)) , Controller.comment.findManyComment);
  
  app.get(apiString.searchComment, middlewares.auth.accessPermission(subStr(apiString.searchComment)) , Controller.comment.searchComment);
  
  app.put(apiString.updateOneComment, middlewares.auth.accessPermission(subStr(apiString.updateOneComment)) , Controller.comment.updateOneComment);
  
  app.post(apiString.insertOneComment, middlewares.auth.accessPermission(subStr(apiString.insertOneComment)) , Controller.comment.insertOneComment);
  
  app.post(apiString.insertManyComment, middlewares.auth.accessPermission(subStr(apiString.insertManyComment)) , Controller.comment.insertManyComment);
  
  app.delete(apiString.deleteOneComment, middlewares.auth.accessPermission(subStr(apiString.deleteOneComment)) , Controller.comment.deleteOneComment);
  
  app.delete(apiString.deleteManyComment, middlewares.auth.accessPermission(subStr(apiString.deleteManyComment)) , Controller.comment.deleteManyComment);
  
  app.delete(apiString.removeOneComment, middlewares.auth.accessPermission(subStr(apiString.removeOneComment)) , Controller.comment.removeOneComment);
  
  app.delete(apiString.removeManyComment, middlewares.auth.accessPermission(subStr(apiString.removeManyComment)) , Controller.comment.removeManyComment);
  
  app.put(apiString.likeComment, middlewares.auth.accessPermission(subStr(apiString.likeComment)), Controller.comment.likeComment);
  
}





