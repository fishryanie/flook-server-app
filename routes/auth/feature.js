const upload = require("../../functions/UploadImage");
const middlewares = require("../../middlewares");
const Controller = require('../../controllers');
const routesString = require('../../constants/routes');
const subStr = require('../../functions/subString')

module.exports = app => { 
  app.get(routesString.findManyFeature, middlewares.auth.accessPermission(subStr(routesString.findManyFeature)) , Controller.feature.findMany);
  
  app.get(routesString.insertOneFeature, middlewares.auth.accessPermission(subStr(routesString.insertOneFeature)) , Controller.feature.findByFeatureGroupId);

  app.get(routesString.deleteOneFeature, middlewares.auth.accessPermission(subStr(routesString.deleteOneFeature)) , Controller.feature.findMany);
  
  app.get(routesString.updateOneFeature, middlewares.auth.accessPermission(subStr(routesString.updateOneFeature)) , Controller.feature.findByFeatureGroupId);

  app.get(routesString.deleteManyFeature, middlewares.auth.accessPermission(subStr(routesString.deleteManyFeature)) , Controller.feature.findMany);
  
  app.get(routesString.insertManyFeature, middlewares.auth.accessPermission(subStr(routesString.insertManyFeature)) , Controller.feature.findByFeatureGroupId);

  app.get(routesString.findOneFeature, middlewares.auth.accessPermission(subStr(routesString.findOneFeature)) , Controller.feature.findMany);
  
  
}