const upload = require("../../functions/UploadImage");
const middlewares = require("../../middlewares");
const Controller = require('../../controllers');
const routes = require('../../app.json').api
const routesString = require('../../constants/routes');

module.exports = app => { 
  app.get(routes.findManyRoles, Controller.roles.findMany);
}