const upload = require("../../functions/UploadImage");
const middlewares = require("../../middlewares");
const Controller = require('../../controllers');
const apiString = require('../../constants/api');
const { subStr } = require("../../functions/globalFunc");

module.exports = app => { 
  app.get(apiString.findOneCast, middlewares.auth.accessPermission(subStr(apiString.findOneCast)) , Controller.cast.findOneCast);
  
  app.get(apiString.findManyCast, middlewares.auth.accessPermission(subStr(apiString.findManyCast)) , Controller.cast.findManyCast);
  
  app.get(apiString.searchCast, middlewares.auth.accessPermission(subStr(apiString.searchCast)) , Controller.cast.searchCast);
  
  app.put(apiString.updateOneCast, middlewares.auth.accessPermission(subStr(apiString.updateOneCast)) , Controller.cast.updateOneCast);
  
  app.post(apiString.insertOneCast, middlewares.auth.accessPermission(subStr(apiString.insertOneCast)) , Controller.cast.insertOneCast);
  
  app.post(apiString.insertManyCast, middlewares.auth.accessPermission(subStr(apiString.insertManyCast)) , Controller.cast.insertManyCast);
  
  app.delete(apiString.deleteOneCast, middlewares.auth.accessPermission(subStr(apiString.deleteOneCast)) , Controller.cast.deleteOneCast);
  
  app.delete(apiString.deleteManyCast, middlewares.auth.accessPermission(subStr(apiString.deleteManyCast)) , Controller.cast.deleteManyCast);
  
  app.delete(apiString.removeOneCast, middlewares.auth.accessPermission(subStr(apiString.removeOneCast)) , Controller.cast.removeOneCast);
  
  app.delete(apiString.removeManyCast, middlewares.auth.accessPermission(subStr(apiString.removeManyCast)) , Controller.cast.removeManyCast);
  
}