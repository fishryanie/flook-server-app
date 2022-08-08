const upload = require("../../functions/UploadImage");
const middlewares = require("../../middlewares");
const Controller = require('../../controllers');
const routesString = require('../../constants/api');
const { subStr } = require("../../functions/globalFunc");

module.exports = app => {

  app.get(routesString.findManyUser,
    middlewares.auth.accessPermission(subStr(routesString.findManyUser)),
    Controller.user.FindManyUser);

  app.get(routesString.searchUser, middlewares.auth.accessPermission(subStr(routesString.searchUser)), Controller.user.FindManyUser);

  app.get(routesString.findOneUser, middlewares.auth.accessPermission(subStr(routesString.findOneUser)),
    Controller.user.FindByIdUserController);

  app.get(routesString.setActiveUser, Controller.user.ActiveUserController);

  app.delete(routesString.deleteOneUser, middlewares.auth.accessPermission(subStr(routesString.deleteOneUser)), Controller.user.DeleteUserController);

  app.delete(routesString.removeOneUser, middlewares.auth.accessPermission(subStr(routesString.removeOneUser)), Controller.user.removeOneUser);

  app.delete(routesString.removeManyUser, middlewares.auth.accessPermission(subStr(routesString.removeManyUser)), Controller.user.removeManyUser);


  app.post(routesString.login, [
    middlewares.auth.verifyUserName(subStr(routesString.login)),
    middlewares.auth.VerifyPassword,
  ], Controller.user.Login);

  app.post(routesString.register, [
    middlewares.auth.VerifyEmail('create_new'),
  ], Controller.user.Register);

  app.post(routesString.insertOneUser, [
    upload.single("images"),
    middlewares.auth.accessPermission(subStr(routesString.insertOneUser)),
    middlewares.auth.verifyUserName('create_new'),
    middlewares.auth.VerifyEmail('create_new'),
    middlewares.auth.VerifyPhoneNumber,
  ], Controller.user.CreateNewController);


  app.put(routesString.forgotPassword, [
    middlewares.auth.VerifyEmail('')
  ], Controller.user.ForgotPasswordController);


  app.put(routesString.changePassword, [
    middlewares.auth.accessPermission(subStr(routesString.changePassword)),
    middlewares.auth.VerifyPassword
  ], Controller.user.ChangePasswordController);


  app.put(routesString.updateOneUser, [
    upload.single("images"),
    middlewares.auth.accessPermission(subStr(routesString.updateOneUser)),
    middlewares.auth.VerifyEmail(''),
  ], Controller.user.UpdateUserController);

  app.get(routesString.findUserLoggin, middlewares.auth.accessPermission(subStr(routesString.findUserLoggin)), Controller.user.findUserLoggin)

  app.get(routesString.logout, middlewares.auth.accessPermission(subStr(routesString.logout)), Controller.user.logOut)
};
