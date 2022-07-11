const folder = { folder: 'Flex-ticket/ImageCast' }
const messages = require("../../constants/messages");
const handleError = require('../../error/HandleError')
const cloudinary = require('../../configs/cloudnary')
const models = require('../../models');

module.exports = {

  findOneCast: async (req, res) => {
    try {
      const movieId = req.query.movieId; 
      const sort = req.query.sort;
      const limit = req.query.limit;
      const result = movieId ? await models.casts.find({ movieId: movieId })
      : sort ? await models.casts.find({ movieId: movieId }).collation({ locale: "en" }).sort({ castName: sort === "ASC" ? 1 : -1 })
      : limit ? await models.casts.find({ movieId: movieId }).limit(5)
      : null
      return res.status(200).send({data: result, success: true});
    } catch (error) {
      handleError.ServerError(error, res)
    }
  },

  findManyCast: async (req, res) => {
    
  },

  insertOneCast: async (req, res) => {
    const castOnData = req.cast;
    if (castOnData) {
      console.log("cast đã tồn tại");
      res.status(200).send(castOnData);
    } else {
      const avatarUpload = await cloudinary.uploader.upload(req.file.path, folder);
      const Cast = new models.casts({
        ...req.body, 
        castAvatar: avatarUpload.secure_url || castAvatar,
      });
      Cast.castAvatarId = avatarUpload.public_id || null
      Cast.save().then(data => res.status(200).send({
        data: data,
        status: 200,
        messages: messages.CreateSuccessfully,
      }))
      .catch((error) => {
        handleError.ServerError(error, res)
      });
    }
  },

  insertManyCast: async (req, res) => {

  },

  updateOneCast: async (req, res) => {
    const castId = req.params.id;
    const option = { new: true };
    let castAvatarNew
    try {
      if(req.file){
        const CastFind = await models.casts.findById(castId);
        await cloudinary.uploader.destroy(CastFind.castAvatarId);
        castAvatarNew = await cloudinary.uploader.upload(req.file.path, folder);
      }
      const Cast = new models.casts({...req.body, _id: castId, 
        castAvatar: req.file ? castAvatarNew.secure_url : castAvatar
      });
      Cast.castAvatarId =  req.file ? castAvatarNew.public_id : null
      const result = await models.casts.findByIdAndUpdate(castId, Cast, option);
      const response = {
        data: result,
        status: 200,
        messages: messages.UpdateSuccessfully
      }
      return res.status(200).send(response);
    } catch (error) {
      handleError.ServerError(error, res)
    }
  },

  deleteOneCast: async (req, res) => {
    try {
      const castId = req.params.id;
      const CastFind = await models.casts.findById(castId);
      await cloudinary.uploader.destroy(CastFind.castAvatarId);
      const result = await models.casts.findByIdAndRemove(id).exec();
      if (!result) {
        handleError.NotFoundError(id, res)
      }
      console.log(messages.DeleteSuccessfully);
      return res.status(200).send({messages: messages.DeleteSuccessfully});
    } catch (error) {
      handleError.ServerError(error, res)
    }
  },

  deleteManyCast: async (req, res) => {

  },

  removeOneCast: async (req, res) => {

  },

  removeManyCast: async (req, res) => {

  },

  searchCast: async (req, res) => {

  }
};


