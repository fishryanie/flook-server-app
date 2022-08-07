const upload = require("../../functions/UploadImage");
const middlewares = require("../../middlewares");
const Controller = require('../../controllers');
const apiString = require('../../constants/api');
const { subStr } = require("../../functions/globalFunc");

module.exports = app => {

  app.get(apiString.findManyUser, middlewares.auth.accessPermission(subStr(apiString.findManyUser)), Controller.user.FindManyUser);

  app.get(apiString.searchUser, middlewares.auth.accessPermission(subStr(apiString.searchUser)), Controller.user.FindManyUser);

  app.get(apiString.findOneUser, middlewares.auth.accessPermission(subStr(apiString.findOneUser)), Controller.user.FindByIdUserController);

  app.get(apiString.setActiveUser, Controller.user.ActiveUserController);

  app.delete(apiString.deleteOneUser, middlewares.auth.accessPermission(subStr(apiString.deleteOneUser)), Controller.user.DeleteUserController);

  app.delete(apiString.removeOneUser, middlewares.auth.accessPermission(subStr(apiString.removeOneUser)), Controller.user.removeOneUser);

  app.delete(apiString.removeManyUser, middlewares.auth.accessPermission(subStr(apiString.removeManyUser)), Controller.user.removeManyUser);


  app.post(apiString.login, [
    middlewares.auth.verifyUserName(subStr(apiString.login)),
    middlewares.auth.VerifyPassword,
  ], Controller.user.Login);

  app.post(apiString.register, [
    middlewares.auth.VerifyEmail('create_new'),
  ], Controller.user.Register);
  
  app.get(apiString.getCoinUser, [
    middlewares.auth.accessPermission(subStr(apiString.getCoinUser)),
  ], Controller.user.getCoinUserController);

  // app.post(apiString.insertOneUser, [
  //   upload.single("avatar"),
  //   middlewares.auth.accessPermission(subStr(apiString.insertOneUser)),
  //   middlewares.auth.verifyUserName('create_new'),
  //   middlewares.auth.VerifyEmail('create_new'),
  // ], Controller.user.CreateNewController);

  app.post(apiString.insertOneUser, [
    upload.single("images"),
    middlewares.auth.accessPermission(subStr(apiString.insertOneUser)),
    middlewares.auth.verifyUserName('create_new'),
    middlewares.auth.VerifyEmail('create_new'),
  ], Controller.user.CreateNewController);

  app.put(apiString.forgotPassword, [
    middlewares.auth.VerifyEmail(''), 
  ], Controller.user.ForgotPasswordController);


  app.put(apiString.changePassword, [
    middlewares.auth.accessPermission(subStr(apiString.changePassword)),
    middlewares.auth.VerifyPassword
  ], Controller.user.ChangePasswordController);


  app.put(apiString.updateOneUser, [
    upload.single("avatar"),
    middlewares.auth.accessPermission(subStr(apiString.updateOneUser)),
    middlewares.auth.VerifyEmail(''),
  ], Controller.user.UpdateUserController);


};
