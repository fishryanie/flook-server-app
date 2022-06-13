const middlewares = require("../../middlewares");
const Controller = require("../../controllers");

module.exports = app => {

  app.get("/api/cast-management/findCastByMovieId",[
  ],Controller.cast.findCastByMovieId );

  app.post("/api/cast-management/addNewCast",[

  ],Controller.cast.addNewCast );

  // update diễn viên
  app.put("/api/cast-management/updateCast/:id",[

  ],Controller.cast.updateCast);

  app.delete("/api/cast-management/deleteCast/:id",[

  ],Controller.cast.deleteCast );

};
