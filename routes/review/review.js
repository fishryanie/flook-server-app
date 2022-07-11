const upload = require("../../functions/UploadImage");
const middlewares = require("../../middlewares");
const Controller = require('../../controllers');
const apiString = require('../../constants/routes');
const subStr = require('../../functions/subString')

module.exports = app => { 
  app.get(apiString.findOneReview, middlewares.auth.accessPermission(subStr(apiString.findOneReview)) , Controller.review.findOneReview);
  
  app.get(apiString.findManyReview, middlewares.auth.accessPermission(subStr(apiString.findManyReview)) , Controller.review.findManyReview);
  
  app.get(apiString.searchReview, middlewares.auth.accessPermission(subStr(apiString.searchReview)) , Controller.review.searchReview);
  
  app.put(apiString.updateOneReview, middlewares.auth.accessPermission(subStr(apiString.updateOneReview)) , Controller.review.updateOneReview);
  
  app.post(apiString.insertOneReview, middlewares.auth.accessPermission(subStr(apiString.insertOneReview)) , Controller.review.insertOneReview);
  
  app.post(apiString.insertManyReview, middlewares.auth.accessPermission(subStr(apiString.insertManyReview)) , Controller.review.insertManyReview);
  
  app.delete(apiString.deleteOneReview, middlewares.auth.accessPermission(subStr(apiString.deleteOneReview)) , Controller.review.deleteOneReview);
  
  app.delete(apiString.deleteManyReview, middlewares.auth.accessPermission(subStr(apiString.deleteManyReview)) , Controller.review.deleteManyReview);
  
  app.delete(apiString.removeOneReview, middlewares.auth.accessPermission(subStr(apiString.removeOneReview)) , Controller.review.removeOneReview);
  
  app.delete(apiString.removeManyReview, middlewares.auth.accessPermission(subStr(apiString.removeManyReview)) , Controller.review.removeManyReview);
  
}





