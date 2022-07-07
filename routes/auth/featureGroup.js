const upload = require("../../functions/UploadImage");
const middlewares = require("../../middlewares");
const Controller = require('../../controllers');
const routesString = require('../../constants/routes');
const subStr = require('../../functions/subString')

module.exports = app => { 
  app.get(routesString.findManyFeatureGroup, middlewares.auth.accessPermission(subStr(routesString.findManyFeatureGroup)) , Controller.featureGroup.findMany);
  
  app.get(routesString.insertOneFeatureGroup, middlewares.auth.accessPermission(subStr(routesString.insertOneFeatureGroup)) , Controller.featureGroup.findMany);

  app.get(routesString.deleteOneFeatureGroup, middlewares.auth.accessPermission(subStr(routesString.deleteOneFeatureGroup)) , Controller.featureGroup.findMany);
  
  app.get(routesString.updateOneFeatureGroup, middlewares.auth.accessPermission(subStr(routesString.updateOneFeatureGroup)) , Controller.featureGroup.findMany);

  app.get(routesString.deleteManyFeatureGroup, middlewares.auth.accessPermission(subStr(routesString.deleteManyFeatureGroup)) , Controller.featureGroup.findMany);
  
  app.get(routesString.insertManyFeatureGroup, middlewares.auth.accessPermission(subStr(routesString.insertManyFeatureGroup)) , Controller.featureGroup.findMany);

  app.get(routesString.findOneFeatureGroup, middlewares.auth.accessPermission(subStr(routesString.findOneFeatureGroup)) , Controller.featureGroup.findMany);
  
  
}