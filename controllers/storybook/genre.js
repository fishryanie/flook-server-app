const messages = require("../../constants/messages");
const handleError = require("../../error/HandleError");
const models = require("../../models");

module.exports = {
  findOneGenre: async (req, res) => {
   
  },

  findManyGenre: async (req, res) => {
    try {
      const result = await models.genres.find({deleted: false});
      return res.status(200).send({data: result, success: true});
    } catch (error) {
      return handleError.ServerError(error, res);
    }
  },

  insertOneGenre: async (req, res) => {
    const dataGenreBook = req.body.name;
  
    try {
      const name = await models.genres.findOne({ name: dataGenreBook });
  
      const newGenreBook = new models.genres({
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
  },

  insertManyGenre: async (req, res) => {
    try {
      console.log('123');
      const result = await models.genres.find();
      return res.status(200).send({data: result, success: true});
    } catch (error) {
      return handleError.ServerError(error, res);
    }
  },

  updateOneGenre: async (req, res) => {
    const id = req.query.id
    const GenreBook = new models.genres({ ...req.body, _id: id});
    const option = { new: true };
    try {
      const result = await models.genres.findByIdAndUpdate(id, GenreBook, option);
      if (!result) {
        console.log(messages.NotFound);
        return res.status(404).send(messages.NotFound);
      }
      console.log({ data: result });
      return res.status(200).send({ messages: messages.UpdateSuccessfully, data: result });
    } catch (error) {
      handleError.ServerError(error, res)
    }
  },

  deleteOneGenre: async (req, res) => {
    try {
      const id = req.params.id;
      const row = await models.genres.findByIdAndRemove(id).exec();
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
  },

  deleteManyGenre: async (req, res) => {

  },

  removeOneGenre: async (req, res) => {
    const option = { new: true };
    const id = req.query.id;
    const genreFind = await models.genres.findById(id);
    let row;

    try {

      if (genreFind.deleted === true) {
        row = await models.genres.findByIdAndUpdate(id, { deleted: false, deleteAt: "", updateAt: genreFind.updateAt, createAt: genreFind.createAt }, option);
      } else {
        row = await models.genres.findByIdAndUpdate(id, { deleted: true, deleteAt: FormatDate.addDays(0), updateAt: genreFind.updateAt, createAt: genreFind.createAt }, option);
      }
      console.log(row);
      if (!row) {
        console.log(messages.NotFound);
        return res.status(404).send({ message: messages.NotFound + id });
      }
      console.log(messages.DeleteSuccessfully);
      return res.status(200).send({ message: messages.DeleteSuccessfully });
    } catch (error) {
      return handleError.ServerError(error, res)
    }

  },

  removeManyGenre: async (req, res) => {
    const listDelete = req.body;
    const option = { new: true };
    console.log('removeManyGenre', listDelete)
    try {
      const result = await models.genres.updateMany(
        { "_id": { $in: listDelete } },
        { $set: { deleted: true, deleteAt: Date.now() } },
        option
      );
      if (!result) {
        return res.status(400).send({ success: false, message: messages.RemoveNotSuccessfully });
      }
      const response = {
        success: true,
        message: messages.RemoveSuccessfully,
      };
      return res.status(200).send(response);
    } catch (error) {
      handleError.ServerError(error, res);
    }
  },

  searchGenre: async (req, res) =>{

  }

}

