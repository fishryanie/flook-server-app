const models = require("../models");
const handleError = require("../error/HandleError");

const CheckCastName = async (req, res, next) => {
  const castName = req.body.castName;
  const castId = req.params.id;
  try {
    const Cast = await models.casts.findOne({ castName: castName });
    if (Cast) {
      castId && res.status(400).send("Tên diễn viên đã tồn tại");
      req.cast = Cast;
      next();
    } else {
      next();
    }
  }catch(error){
    handleError.ServerError(error, res)
  }
};

module.exports = {
  CheckCastName,
};