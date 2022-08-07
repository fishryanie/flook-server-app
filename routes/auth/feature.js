const upload = require("../../functions/UploadImage");
const middlewares = require("../../middlewares");
const Controller = require('../../controllers');
const apiString = require('../../constants/api');
const { subStr } = require("../../functions/globalFunc");

module.exports = app => { 
  app.get(apiString.findOneFeature, middlewares.auth.accessPermission(subStr(apiString.findOneFeature)) , Controller.feature.findOneFeature);
  
  app.get(apiString.findManyFeature, middlewares.auth.accessPermission(subStr(apiString.findManyFeature)) , Controller.feature.findManyFeature);
  
  app.get(apiString.searchFeature, middlewares.auth.accessPermission(subStr(apiString.searchFeature)) , Controller.feature.searchFeature);
  
  app.post(apiString.insertOneFeature, middlewares.auth.accessPermission(subStr(apiString.insertOneFeature)) , Controller.feature.insertOneFeature);
  
  app.post(apiString.insertManyFeature, middlewares.auth.accessPermission(subStr(apiString.insertManyFeature)) , Controller.feature.insertManyFeature);
  
  app.put(apiString.updateOneFeature, middlewares.auth.accessPermission(subStr(apiString.updateOneFeature)) , Controller.feature.updateOneFeature);
  
  app.delete(apiString.deleteOneFeature, middlewares.auth.accessPermission(subStr(apiString.deleteOneFeature)) , Controller.feature.deleteOneFeature);
  
  app.delete(apiString.deleteManyFeature, middlewares.auth.accessPermission(subStr(apiString.deleteManyFeature)) , Controller.feature.deleteManyFeature);
  
  app.delete(apiString.removeOneFeature, middlewares.auth.accessPermission(subStr(apiString.removeOneFeature)) , Controller.feature.removeOneFeature);

  app.delete(apiString.removeManyFeature, middlewares.auth.accessPermission(subStr(apiString.removeManyFeature)) , Controller.feature.removeManyFeature);

  
}