const upload = require("../../functions/UploadImage");
const middlewares = require("../../middlewares");
const Controller = require('../../controllers');
const routesString = require('../../constants/routes');

module.exports = app => { 
  app.get("/api/role-management/findMany", Controller.roles.findMany);
}