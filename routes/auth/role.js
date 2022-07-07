const upload = require("../../functions/UploadImage");
const middlewares = require("../../middlewares");
const Controller = require('../../controllers');
const routesString = require('../../constants/routes');
const subStr = require('../../functions/subString')

module.exports = app => { 
  app.get(routesString.findManyRole, middlewares.auth.accessPermission(subStr(routesString.findManyRole)) , Controller.roles.findMany);
  
  app.get(routesString.insertOneRole, middlewares.auth.accessPermission(subStr(routesString.insertOneRole)) , Controller.roles.findMany);

  app.get(routesString.deleteOneRole, middlewares.auth.accessPermission(subStr(routesString.deleteOneRole)) , Controller.roles.findMany);
  
  app.get(routesString.updateOneRole, middlewares.auth.accessPermission(subStr(routesString.updateOneRole)) , Controller.roles.findMany);

  app.get(routesString.deleteManyRole, middlewares.auth.accessPermission(subStr(routesString.deleteManyRole)) , Controller.roles.findMany);
  
  app.get(routesString.insertManyRole, middlewares.auth.accessPermission(subStr(routesString.insertManyFeature)) , Controller.roles.findMany);

  app.get(routesString.findOneRole, middlewares.auth.accessPermission(subStr(routesString.findOneFeature)) , Controller.roles.findMany);
  
  
}