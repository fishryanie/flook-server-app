const upload = require("../../functions/UploadImage");
const middlewares = require("../../middlewares");
const Controller = require('../../controllers');
const apiString = require('../../constants/api');
const { subStr } = require("../../functions/globalFunc");

module.exports = app => {

  app.get(apiString.findOneUser, middlewares.auth.accessPermission(subStr(apiString.findOneUser)), Controller.user.findOneUser);

  app.get(apiString.findManyUser, middlewares.auth.accessPermission(subStr(apiString.findManyUser)), Controller.user.findManyUser);

  app.get(apiString.searchUser, middlewares.auth.accessPermission(subStr(apiString.searchUser)), Controller.user.findManyUser);

  app.get(apiString.setActiveUser, Controller.user.setActive);

  app.put(apiString.forgotPassword, middlewares.auth.VerifyEmail(apiString.forgotPassword), Controller.user.forgotPassword);

  app.post(apiString.login, [middlewares.auth.verifyUserName(apiString.login), middlewares.auth.VerifyPassword], Controller.user.Login);

  app.post(apiString.register, middlewares.auth.VerifyEmail(apiString.register), Controller.user.Register);

  app.delete(apiString.removeOneUser, middlewares.auth.accessPermission(subStr(apiString.removeOneUser)), Controller.user.removeOneUser);

  app.delete(apiString.removeManyUser, middlewares.auth.accessPermission(subStr(apiString.removeManyUser)), Controller.user.removeManyUser);

  app.delete(apiString.deleteOneUser, middlewares.auth.accessPermission(subStr(apiString.deleteOneUser)), Controller.user.DeleteUserController);

  
  app.post(apiString.insertOneUser, [
    upload.single("images"),
    middlewares.auth.accessPermission(subStr(apiString.insertOneUser)),
    middlewares.auth.verifyUserName(apiString.insertOneUser),
    middlewares.auth.VerifyEmail(apiString.insertOneUser),
  ], Controller.user.insertOneUser);


  app.put(apiString.changePassword, [
    middlewares.auth.accessPermission(subStr(apiString.changePassword)),
    middlewares.auth.VerifyPassword
  ], Controller.user.changePassword);


  // app.put(apiString.updateOneUser, [
  //   upload.single("images"),
  //   middlewares.auth.accessPermission(subStr(apiString.updateOneUser)),
  //   middlewares.auth.VerifyEmail(''),
  // ], Controller.user.updateOneUser);

  app.put(apiString.updateOneUser, [
    upload.single("images"),
    middlewares.auth.accessPermission(subStr(apiString.updateOneUser)),
  ], Controller.user.updateOneUser);

 
  app.put(apiString.updateOneUserMobile, [
    upload.single("images"),
    middlewares.auth.accessPermission(subStr(apiString.updateOneUserMobile)),
  ], Controller.user.updateOneUserMobile);

};
