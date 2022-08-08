const upload = require("../../functions/UploadImage");
const middlewares = require("../../middlewares");
const Controller = require('../../controllers');
const apiString = require('../../constants/api');
const { subStr } = require("../../functions/globalFunc");

module.exports = app => { 

  app.get(apiString.findOneChapter, Controller.chapter.findOneChapter);//, middlewares.auth.accessPermission(subStr(apiString.findOneChapter)) 
  
  app.get(apiString.findManyChapter, middlewares.auth.accessPermission(subStr(apiString.findManyChapter)) , Controller.chapter.findManyChapter);
  
  app.post(apiString.searchChapter, Controller.chapter.searchChapter);//, middlewares.auth.accessPermission(subStr(apiString.searchChapter)) 
  
  app.put(apiString.updateOneChapter, upload.single("images"), middlewares.auth.accessPermission(subStr(apiString.updateOneChapter)) , Controller.chapter.updateOneChapter);
  
  app.post(apiString.insertOneChapter, upload.single("images"), middlewares.auth.accessPermission(subStr(apiString.insertOneChapter)) , Controller.chapter.insertOneChapter);
  
  app.post(apiString.insertManyChapter, middlewares.auth.accessPermission(subStr(apiString.insertManyChapter)) , Controller.chapter.insertManyChapter);
  
  app.delete(apiString.deleteOneChapter, middlewares.auth.accessPermission(subStr(apiString.deleteOneChapter)) , Controller.chapter.deleteOneChapter);
  
  app.delete(apiString.deleteManyChapter, middlewares.auth.accessPermission(subStr(apiString.deleteManyChapter)) , Controller.chapter.deleteManyChapter);
  
  app.delete(apiString.removeOneChapter, middlewares.auth.accessPermission(subStr(apiString.removeOneChapter)) , Controller.chapter.removeOneChapter);
  
  app.delete(apiString.removeManyChapter, middlewares.auth.accessPermission(subStr(apiString.removeManyChapter)) , Controller.chapter.removeManyChapter);
  
}





