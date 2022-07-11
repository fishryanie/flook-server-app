const upload = require("../../functions/UploadImage");
const middlewares = require("../../middlewares");
const Controller = require('../../controllers');
const apiString = require('../../constants/api');
const { subStr } = require("../../functions/globalFunc");


module.exports = app => { 
  app.get(apiString.findOneRole, middlewares.auth.accessPermission(subStr(apiString.findOneRole)) , Controller.roles.findOneRole);

  app.get(apiString.findManyRole, middlewares.auth.accessPermission(subStr(apiString.findManyRole)) , Controller.roles.findManyRole);
  
  app.get(apiString.searchRole, middlewares.auth.accessPermission(subStr(apiString.searchRole)) , Controller.roles.searchRole);
    
  app.post(apiString.insertOneRole, middlewares.auth.accessPermission(subStr(apiString.insertOneRole)) , Controller.roles.insertOneRole);
  
  app.post(apiString.insertManyRole, middlewares.auth.accessPermission(subStr(apiString.insertManyRole)) , Controller.roles.insertManyRole);

  app.put(apiString.updateOneRole, middlewares.auth.accessPermission(subStr(apiString.updateOneRole)) , Controller.roles.updateOneRole);
  
  app.delete(apiString.deleteOneRole, middlewares.auth.accessPermission(subStr(apiString.deleteOneRole)) , Controller.roles.deleteOneRole);
  
  app.delete(apiString.deleteManyRole, middlewares.auth.accessPermission(subStr(apiString.deleteManyRole)) , Controller.roles.deleteManyRole);
  
  app.delete(apiString.removeOneRole, middlewares.auth.accessPermission(subStr(apiString.removeOneRole)) , Controller.roles.removeOneRole);

  app.delete(apiString.removeManyRole, middlewares.auth.accessPermission(subStr(apiString.removeManyRole)) , Controller.roles.removeManyRole);

}