const { MODEL_MOVIES, MODEL_USERS } = require("../../models");
const cloudinary = require('../../configs/cloudnary');
const message = require("../../constants/Messages");
const handleError = require("../../error/HandleError");
const FormatDate = require("../../utils/FormatDate");
const folder_image = { folder: 'Flex-ticket/ImageMovie/image' }
const folder_background = { folder: 'Flex-ticket/ImageMovie/background' }
const folder_otherImage = { folder: 'Flex-ticket/ImageMovie/other' }

const NEW = FormatDate.addArrayDays("NEW");
const ISPLAYING = FormatDate.addArrayDays("ISPLAYING");
const COMMING_SOON = FormatDate.addArrayDays("COMMING_SOON");


const FindMovieController = async (req, res) => {
  const id = req.query.id
  const movieNew = req.query.new
  const commingSoon = req.query.commingSoon
  const movieIsplaying = req.query.isPlaying
  const page = parseInt(req.query.page)
  const PAGE_SIZE = 10
  const skip = page ? (page-1) * PAGE_SIZE : null
  try { 
    const count = await MODEL_MOVIES.count()
    const result = id ? await MODEL_MOVIES.findById({'_id': id})
    : page ? await MODEL_MOVIES.find().skip(skip).limit(PAGE_SIZE)
    : page && (movieNew || movieIsplaying || commingSoon) ? await MODEL_MOVIES.find({'premiere':{ $in: 
      movieNew ? NEW
      : movieIsplaying ? ISPLAYING
      : commingSoon ? COMMING_SOON
      : []
      }}).skip(skip).limit(PAGE_SIZE)
    : null  
    if(!result){
      handleError.NotFoundError(id, res) 
    } 
    return res.status(200).send({data: result, status:200, count:count})
  } catch (error) {
    handleError.ServerError(error, res);
  }
};

const FindListFavoriteByUserId = async (req, res) => {
  try {
    const userId = req.userId;
    const result = await MODEL_USERS.findById(userId).populate(
      "listMovieFavorite"
    );
    if (!result) {
      handleError.NotFoundError(userId, res);
    }
    return res.status(200).send(result.listMovieFavorite);
  } catch (error) {
    handleError.ServerError(error, res);
  }
};


const AddMovieController = async (req, res) => {
  const dataMovie = req.body.name;
  try {
    const nameMovie = await MODEL_MOVIES.findOne({ name: dataMovie });
    if (nameMovie) {
      handleError.ServerError(nameMovie, res)
    }
    const avatarUpload = await cloudinary.uploader.upload(req.file.path, folder);
    const newMovie = new MODEL_MOVIES({
      ...req.body, images: {
        image: avatarUpload.secure_url

      }});
  } catch (error) {
    handleError.ServerError(err, res);
  }

  if (nameMovie) {
    console.log("đã tồn tại!");
    res.status(200).send(nameMovie);
  } else {
   

    newMovie.save()
    .then((data) =>
      res.status(200).send({
        data: data,
        status: 200,
        message: message.CreateSuccessfully,
      })
    )
    .catch((err) => {
      
    });
  }
};

const UpdateMovieController = async (req, res) => {
  const id = req.query.id
  const Movie = new MODEL_MOVIES({ ...req.body, _id: id});
  const option = { new: true };
  try {
    const result = await MODEL_MOVIES.findByIdAndUpdate(id, Movie, option);
    if (!result) {
      console.log(message.NotFound);
      return res.status(404).send(message.NotFound);
    }
    console.log({ data: result });
    return res.status(200).send({ messages: message.UpdateSuccessfully, data: result });
  } catch (error) {
    handleError.ServerError(error, res)
  }
}

const DeleteAllMovieController = async (req, res) => {
  await MODEL_MOVIES.deleteMany()
  .then(() => {
    const response = {
      status: 200,
      message: message.DeleteSuccessfully,
    };
    console.log(response);
    return res.status(200).send(response);
  })
  .catch((err) => {
    ServerError(err, res);
  });
};


const DeleteMovieController = async (req, res) => {
  try {
    const id = req.params.id;
    const row = await MODEL_MOVIES.findByIdAndRemove(id).exec();
    if (!row) {
      console.log(message.NotFound);
      return res.status(404).send({ messages: message.NotFound + id });
    }
    console.log(message.DeleteSuccessfully);
    return res.status(200).send({ messages: message.DeleteSuccessfully });
  } catch (error) {
    handleError.ServerError(error, res);
  }
};



module.exports = {
  FindMovieController,
  FindListFavoriteByUserId,
  DeleteAllMovieController,
  AddMovieController,
  DeleteMovieController,
  UpdateMovieController,
};
