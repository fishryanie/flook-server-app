const upload = require("../../functions/UploadImage");
const middlewares = require("../../middlewares");
const Controller = require('../../controllers');
const routesString = require('../../constants/routes');
const subStr = require('../../functions/subString')


module.exports = app => {
  //Tìm diễn viên bằng ID
  app.get(routesString.findCastByMovieId, middlewares.auth.accessPermission(subStr(routesString.findCastByMovieId)), Controller.cast.findCastByMovieId);
  // thêm diễn viên
  app.post(routesString.addNewCast, middlewares.auth.accessPermission(subStr(routesString.addNewCast)), Controller.cast.addNewCast);

  // update diễn viên
  app.put(routesString.updateCast, middlewares.auth.accessPermission(subStr(routesString.updateCast)), Controller.cast.updateCast);
  // Xoá diễn viên
  app.delete(routesString.deleteCast, middlewares.auth.accessPermission(subStr(routesString.deleteCast)), Controller.cast.deleteCast);



};

