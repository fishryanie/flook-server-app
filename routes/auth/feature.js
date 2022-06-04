const upload = require("../../functions/UploadImage");
const middlewares = require("../../middlewares");
const Controller = require('../../controllers');
const routesString = require('../../constants/routes');

module.exports = app => { 
  app.get("/api/feature-management/findMany", Controller.feature.findMany);
  
  app.get("/api/feature-management/findByFeatureGroupId/:id", Controller.feature.findByFeatureGroupId);
}