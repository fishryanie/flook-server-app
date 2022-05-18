const middlewares = require("../../middlewares");
const Controller = require("../../controllers");

module.exports = app => {

  app.get("/api/cast-management/findCastByMovieId",[
    middlewares.auth.VerifyToken
  ],Controller.cast.findCastByMovieId );

  app.post("/api/cast-management/addNewCast",[
    middlewares.auth.VerifyToken,
    middlewares.auth.CheckAuth,
    middlewares.cast.CheckCastName,
  ],Controller.cast.addNewCast );

  // update diễn viên
  app.put("/api/cast-management/updateCast/:id",[
    middlewares.auth.VerifyToken,
    middlewares.auth.CheckAuth,
    middlewares.cast.CheckCastName,
  ],Controller.cast.updateCast);

  app.delete("/api/cast-management/deleteCast/:id",[
    middlewares.auth.VerifyToken, 
    middlewares.auth.CheckAuth
  ],Controller.cast.deleteCast );

};
