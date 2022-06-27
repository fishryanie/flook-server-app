const messages = require("../../constants/messages");
const handleError = require("../../error/HandleError");
const models = require("../../models");

module.exports = {

  findCategories: async (req, res) => {
    try {
      const result = await models.categories.find();
      return res.status(200).send(result);
    } catch (error) {
      handleError.ServerError(error, res);
    }
  },


  addCategories: async (req, res) => {
    const dataCategoriesBook = req.body.name;

    try {
      const name = await models.categories.findOne({ name: dataCategoriesBook });

      const newCategoriesBook = new models.categories({
        ...req.body
      });

      if (name) {
        console.log("tên loại đã tồn tại!!!");
        res.status(200).send(name);
      }
      const result = await newCategoriesBook.save();
      if (result) {
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


  updateCategories: async (req, res) => {

    const id = req.params.id
    console.log("id categories", id)

    const CategoriesBook = new models.categories({ ...req.body, _id: id, updateAt: Date.now });
    console.log("CategoriesBook", CategoriesBook)
    const option = { new: true };
    try {
      const result = await models.categories.findByIdAndUpdate(id, { $set: CategoriesBook }, option);
      console.log("result", result)

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


  deleteCategories: async (req, res) => {
    try {
      const id = req.params.id;
      const row = await models.categories.findByIdAndRemove(id).exec();
      console.log(id)
      if (!row) {
        return res.status(404).send({ messages: messages.NotFound + id });
      }
      console.log(messages.DeleteSuccessfully);
      return res.status(200).send({ messages: messages.DeleteSuccessfully });
    } catch (error) {
      handleError.ServerError(error, res);
    }

  },
}