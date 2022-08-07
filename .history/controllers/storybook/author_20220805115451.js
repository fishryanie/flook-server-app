const cloudinary = require('../../configs/cloudnary')
const models = require("../../models");
const handleError = require("../../error/HandleError");
const messages = require("../../constants/messages");
const { addDays } = require('../../functions/globalFunc');
const folder = { folder: 'Flex-ticket/ImageAuther' }


module.exports = {


  findOneAuthor: (req, res) => {
    
  },

  findManyAuthor: async (req, res) => {
    try {
      Promise.all([
        models.authors.find({ deleted: false }).populate('license'),
        models.authors.find({ deleted: false }).count()
      ]).then((result) => {
        return res.status(200).send({ data: result[0], count: result[1], success: true });
      })
    } catch (error) {
      handleError.ServerError(error, res);
    }
  },


  insertOneAuthor: async (req, res) => {
    const dataAuther = req.body.name;
    try {
      const name = await models.authors.findOne({ name: dataAuther });
      if (name) {
        console.log("tên tác giả tồn tại!!!");
        return res.status(400).send(name);
      }
      const imageUpload = await cloudinary.uploader.upload(req.file?.path, folder);
      const newAuthor = new models.authors({
        ...req.body, image: { id: imageUpload.public_id, url: imageUpload.secure_url }, createAt: Date.now()
      });
      const book = await models.ebooks.find({ title: { $in: req.body.book } })
      newAuthor.book = book?.map((book) => book._id);
      const result = await newAuthor.save();
      if (result) {
        const response = {
          data: result,
        }
        return res.status(200).send(response);
      }
    } catch (error) {
      handleError.ServerError(error, res);
    }  
  },

  insertManyAuthor: async (req, res) => {

  },

  updateOneAuthor: async (req, res) => {

  },

  deleteOneAuthor: async (req, res) => {
    try {
      const id = req.query.id;
      const row = await models.authors.findByIdAndDelete(id).exec();
      console.log(id)
      if (!row) {
        console.log(messages.NotFound);
        return res.status(404).send({ message: messages.NotFound + id });
      }
      console.log(messages.DeleteSuccessfully);
      return res.status(200).send({ message: messages.DeleteSuccessfully });
    } catch (error) {
      handleError.ServerError(error, res);
    }
  },

  deleteManyAuthor: async (req, res) => {
    try {
      const listDelete = req.body;
      const row = await models.authors.deleteMany({ _id: { $in: { listDelete } } });
      if (!row) {
        console.log(messages.NotFound);
        return res.status(404).send({ message: messages.NotFound + listDelete });
      }
      console.log(messages.DeleteSuccessfully);
      return res.status(200).send({ message: messages.DeleteSuccessfully });
    } catch (error) {
      handleError.ServerError(error, res);
    }
  },

  removeOneAuthor: async (req, res) => {
    const option = { new: true };
    const id = req.query.id;
    const authorFind = await models.authors.findById(id);
    let row;
  
    try {
  
      if (authorFind.deleted === true) {
        row = await models.authors.findByIdAndUpdate(id, { deleted: false, deleteAt: "", updateAt: authorFind.updateAt, createAt: authorFind.createAt }, option);
      } else {
        row = await models.authors.findByIdAndUpdate(id, { deleted: true, deleteAt: addDays(0), updateAt: authorFind.updateAt, createAt: authorFind.createAt }, option);
      }
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

  removeManyAuthor: async (req, res) => {
    const listDelete = req.body;
    const option = { new: true };
    console.log('removeManyAuthor', listDelete)
    try {
      const result = await models.authors.updateMany(
        { "_id": { $in: listDelete } },
        { $set: { deleted: true, deleteAt: Date.now() } },
        option
      );
      if (!result) {
        return res.status(400).send({ success: false, message: messages.RemoveNotSuccessfully });
      }
      return res.status(200).send({success:true, message: messages.DeleteSuccessfully });
    } catch (error) {
      handleError.ServerError(error, res);
    }
  },

  searchAuthor: async (req, res) =>{
    
  }
}
