const upload = require("../../functions/UploadImage");
const middlewares = require("../../middlewares");
const Controller = require('../../controllers');
const routesString = require('../../constants/api')
const { subStr } = require("../../functions/globalFunc");

module.exports = app => { 
  app.get(routesString.findOneReview, middlewares.auth.accessPermission(subStr(routesString.findOneReview)) , Controller.review.findOneReview);
  
  app.get(routesString.findManyReview, middlewares.auth.accessPermission(subStr(routesString.findManyReview)) , Controller.review.findManyReview);
  
  app.get(routesString.searchReview, middlewares.auth.accessPermission(subStr(routesString.searchReview)) , Controller.review.searchReview);
  
  app.put(routesString.updateOneReview, middlewares.auth.accessPermission(subStr(routesString.updateOneReview)) , Controller.review.updateOneReview);
  
  app.post(routesString.insertOneReview, middlewares.auth.accessPermission(subStr(routesString.insertOneReview)) , Controller.review.insertOneReview);
  
  app.post(routesString.insertManyReview, middlewares.auth.accessPermission(subStr(routesString.insertManyReview)) , Controller.review.insertManyReview);
  
  app.delete(routesString.deleteOneReview, middlewares.auth.accessPermission(subStr(routesString.deleteOneReview)) , Controller.review.deleteOneReview);
  
  app.delete(routesString.deleteManyReview, middlewares.auth.accessPermission(subStr(routesString.deleteManyReview)) , Controller.review.deleteManyReview);
  
  app.delete(routesString.removeOneReview, middlewares.auth.accessPermission(subStr(routesString.removeOneReview)) , Controller.review.removeOneReview);
  
  app.delete(routesString.removeManyReview, middlewares.auth.accessPermission(subStr(routesString.removeManyReview)) , Controller.review.removeManyReview);
  
}





