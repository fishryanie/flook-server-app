const upload = require("../../functions/UploadImage");
const middlewares = require("../../middlewares");
const Controller = require('../../controllers');
const routesString = require('../../constants/routes');
const subStr = require('../../functions/subString')

module.exports = app => {

  app.get(routesString.findManyUser, 
    middlewares.auth.accessPermission(subStr(routesString.findManyUser)), 
    Controller.auth.FindManyUser);

  app.get(routesString.findOneUser, middlewares.auth.accessPermission(subStr(routesString.findOneUser)), 
  Controller.auth.FindByIdUserController);

  app.get(routesString.setActiveUser, Controller.auth.ActiveUserController);

  app.delete(routesString.deleteOneUser, middlewares.auth.accessPermission(subStr(routesString.deleteOneUser)), Controller.auth.DeleteUserController );

  app.post(routesString.login,[
    middlewares.auth.verifyUserName('login_app'),
    middlewares.auth.VerifyPassword,
  ], Controller.auth.Login);

  app.post(routesString.register,[
    middlewares.auth.VerifyEmail('create_new'),
  ], Controller.auth.Register);

  app.post(routesString.insertOneUser,[
    upload.single("avatar"),
    middlewares.auth.accessPermission('create_new'),
    middlewares.auth.verifyUserName('create_new'),
    middlewares.auth.VerifyEmail('create_new'),
    middlewares.auth.VerifyPhoneNumber,
  ], Controller.auth.CreateNewController);


  app.put(routesString.forgotPassword, [
    middlewares.auth.VerifyEmail(subStr(routesString.forgotPassword))
  ], Controller.auth.ForgotPasswordController);


  app.put(routesString.changePassword,[
    middlewares.auth.accessPermission(subStr(routesString.changePassword)),
    middlewares.auth.VerifyPassword
  ], Controller.auth.ChangePasswordController );


  app.put(routesString.updateOneUser,[
    upload.single("avatar"),
    middlewares.auth.accessPermission(subStr(routesString.updateOneUser)),
    middlewares.auth.VerifyEmail(subStr(routesString.updateOneUser)),
  ], Controller.auth.UpdateUserController );


};
