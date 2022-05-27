const { MODEL_GENRES, MODEL_MANGAS } = require("../models");
const messages = require("../constants/Messages");
const handleError = require("../Error/HandleError");


const findGenre = async (req, res) => {
  try {
    const result = await MODEL_GENRES.find();
    return res.status(200).send(result);
  } catch (error) {
    handleError.ServerError(error, res);
  }
};

const addGenre = async (req, res) => {
  const dataGenreBook = req.body.name;

  try {
    const name = await MODEL_GENRES.findOne({ name: dataGenreBook });

    const newGenreBook = new MODEL_GENRES({
      ...req.body
    });

    if (name){
      console.log("tên loại đã tồn tại!!!");
      res.status(200).send(name);
    }
    const result = await newGenreBook.save();
    if (result){
      const response = {
        data: result,
        status: 200,
      }
      return res.status(200).send(response);
    }
  } catch (error) {
    handleError.ServerError(error, res);
  }

};

const deleteGenre = async (req, res) => {
  try {
    const id = req.params.id;
    const row = await MODEL_GENRES.findByIdAndRemove(id).exec();
    console.log(id)
    if (!row) {
      console.log(messages.NotFound);
      return res.status(404).send({ messages: messages.NotFound + id });
    }
    console.log(messages.DeleteSuccessfully);
    return res.status(200).send({ messages: messages.DeleteSuccessfully });
  } catch (error) {
    handleError.ServerError(error, res);
  }

};

const deleteGenreMany = async (req, res) => {
  try {
    const id = req.params.id;
    const row = await MODEL_GENRES.deleteMany(
      {
        _id: { 
          $in: [
            id
          ]
        }
      }
    )
    console.log(id)
    if (!row) {
      console.log(messages.NotFound);
      return res.status(404).send({ messages: messages.NotFound + id });
    }
    console.log(messages.DeleteSuccessfully);
    return res.status(200).send({ messages: messages.DeleteSuccessfully });
  } catch (error) {
    handleError.ServerError(error, res);
  }

};

const deletedGenre = async (req, res) => {

  const option = { new: true };
  const id = req.params.id;
  const genreFind = await MODEL_GENRES.findById(id);
  let row;

  try {

    if (genreFind.deleted === true) {
      row = await MODEL_GENRES.findByIdAndUpdate(id, { deleted: false }, option);
    } else {
      row = await MODEL_GENRES.findByIdAndUpdate(id, { deleted: true }, option);
    }
    console.log(row);
    if (!row) {
      console.log(messages.NotFound);
      return res.status(404).send({ messages: messages.NotFound + id });
    }
    console.log(messages.DeleteSuccessfully);
    return res.status(200).send({ messages: messages.DeleteSuccessfully });
  } catch (error) {
    return handleError.ServerError(error, res)
  }

};

const deletedGenreMany = async (req, res) => {

  const option = { multi: true };
  const id = req.params.id;
  const genreFind = await MODEL_GENRES.findById(id);
  let row;

  try {

    if (genreFind.deleted === true) {
      row = await MODEL_GENRES.updateMany({_id: { $in: id }}, { $set:  { deleted: false } }, option);
    } else {
      row = await MODEL_GENRES.updateMany({_id: { $in: id }}, { $set:  { deleted: true } }, option);
    }
    console.log(row);
    if (!row) {
      console.log(messages.NotFound);
      return res.status(404).send({ messages: messages.NotFound + id });
    }
    console.log(messages.DeleteSuccessfully);
    return res.status(200).send({ messages: messages.DeleteSuccessfully });
  } catch (error) {
    return handleError.ServerError(error, res)
  }

};

const updateGenre = async (req, res) => {
  const id = req.query.id
  const GenreBook = new MODEL_GENRES({ ...req.body, _id: id});
  const option = { new: true };
  try {
    const result = await MODEL_GENRES.findByIdAndUpdate(id, GenreBook, option);
    if (!result) {
      console.log(messages.NotFound);
      return res.status(404).send(messages.NotFound);
    }
    console.log({ data: result });
    return res.status(200).send({ messages: messages.UpdateSuccessfully, data: result });
  } catch (error) {
    handleError.ServerError(error, res)
  }
}

module.exports = {
  findGenre,
  addGenre,
  deleteGenre,
  deleteGenreMany,
  deletedGenre,
  deletedGenreMany,
  updateGenre,
}