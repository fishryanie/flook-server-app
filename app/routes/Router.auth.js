const upload = require("../utils/UploadImage");
const middlewares = require("../middlewares");
const Controller = require('../controllers');

module.exports = app => {

  app.get("/api/user-management/getAllListUser",[
    middlewares.auth.VerifyToken, 
    middlewares.auth.CheckAuth
  ], Controller.auth.FindAllUserController);


  app.get("/api/user-management/listMovieFavorite",[
    middlewares.auth.VerifyToken
  ], Controller.auth.FindListMovieFavorite);


  app.get("/api/user-management/getProfile",[
    middlewares.auth.VerifyToken
  ], Controller.auth.FindByIdUserController);


  app.get("/api/user-management/findUsersNotActive", [
    middlewares.auth.VerifyToken, 
    middlewares.auth.CheckAuth
  ], Controller.auth.FindUserNotActive);


  app.get("/api/user-management/setActiveUser/:id",
  Controller.auth.ActiveUserController);

  app.post("/api/user-management/login",[
    middlewares.auth.VerifyUserName, 
    middlewares.auth.VerifyPassword,
  ], Controller.auth.LoginController);


  app.post("/api/user-management/register",[
    middlewares.auth.VerifyEmail,
    middlewares.auth.VerifyPhoneNumber,
    middlewares.auth.VerifyUserName,
  ], Controller.auth.RegisterController);


  app.post("/api/user-management/create",[
    upload.single("avatar"),
    middlewares.auth.VerifyToken,
    middlewares.auth.CheckAuth,
    middlewares.auth.CheckPermission,
    middlewares.auth.VerifyEmail,
    middlewares.auth.VerifyUserName,
    middlewares.auth.VerifyPhoneNumber,
  ], Controller.auth.CreateNewController);


  app.put("/api/user-management/forgotPassword",[
    middlewares.auth.VerifyEmail
  ], Controller.auth.ForgotPasswordController);


  app.put("/api/user-management/changePassword",[
    middlewares.auth.VerifyToken,
    middlewares.auth.VerifyPassword
  ], Controller.auth.ChangePasswordController );


  app.put("/api/user-management/update/:id",[
    upload.single("avatar"),
    middlewares.auth.VerifyToken,
    middlewares.auth.CheckAuth,
    middlewares.auth.CheckPermission,
    middlewares.auth.VerifyEmail,
  ], Controller.auth.UpdateUserController );


  app.delete("/api/user-management/deleteUser/:id",[
    middlewares.auth.VerifyToken,
    middlewares.auth.CheckAuth,
    middlewares.auth.CheckPermission,
  ], Controller.auth.DeleteUserController );
};
