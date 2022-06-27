const messages = require("../../constants/messages");
const handleError = require("../../error/HandleError");
const models = require("../../models");

module.exports = {

  findGenre: async (req, res) => {
    try {
      const result = await models.genres.find();
      return res.status(200).send({data: result, success: true});
    } catch (error) {
      return handleError.ServerError(error, res);
    }
  },


  addGenre: async (req, res) => {
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
  

  updateGenre: async (req, res) => {
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

  
  deleteGenre: async (req, res) => {
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

  
}

