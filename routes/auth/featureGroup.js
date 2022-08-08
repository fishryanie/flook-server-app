const upload = require("../../functions/UploadImage");
const middlewares = require("../../middlewares");
const Controller = require('../../controllers');
const apiString = require('../../constants/api');
const { subStr } = require("../../functions/globalFunc");

module.exports = app => { //, middlewares.auth.accessPermission(subStr(apiString.findOneFeatureGroup))
  app.get(apiString.findOneFeatureGroup,Controller.featureGroup.findOneFeatureGroup);
  
  app.get(apiString.findManyFeatureGroup, middlewares.auth.accessPermission(subStr(apiString.findManyFeatureGroup)) , Controller.featureGroup.findManyFeatureGroup);
  
  app.get(apiString.searchFeatureGroup, middlewares.auth.accessPermission(subStr(apiString.searchFeatureGroup)) , Controller.featureGroup.searchFeatureGroup);
  
  app.put(apiString.updateOneFeatureGroup, middlewares.auth.accessPermission(subStr(apiString.updateOneFeatureGroup)) , Controller.featureGroup.updateOneFeatureGroup);
  
  app.put(apiString.insertManyFeatureGroup, middlewares.auth.accessPermission(subStr(apiString.insertManyFeatureGroup)) , Controller.featureGroup.insertManyFeatureGroup);
  
  app.post(apiString.insertOneFeatureGroup, middlewares.auth.accessPermission(subStr(apiString.insertOneFeatureGroup)) , Controller.featureGroup.insertOneFeatureGroup);
  
  app.delete(apiString.deleteOneFeatureGroup, middlewares.auth.accessPermission(subStr(apiString.deleteOneFeatureGroup)) , Controller.featureGroup.deleteOneFeatureGroup);
  
  app.delete(apiString.deleteManyFeatureGroup, middlewares.auth.accessPermission(subStr(apiString.deleteManyFeatureGroup)) , Controller.featureGroup.deleteManyFeatureGroup);
  
  app.delete(apiString.removeOneFeatureGroup, middlewares.auth.accessPermission(subStr(apiString.removeOneFeatureGroup)) , Controller.featureGroup.removeOneFeatureGroup);

  app.delete(apiString.removeManyFeatureGroup, middlewares.auth.accessPermission(subStr(apiString.removeManyFeatureGroup)) , Controller.featureGroup.removeManyFeatureGroup);



}