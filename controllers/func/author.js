const { MODEL_BOOKS, MODEL_AUTHORS } = require("../../models");
const cloudinary = require('../../configs/cloudnary')
const handleError = require("../../error/HandleError");
const messages = require("../../constants/messages");

const folder = { folder: 'Flex-ticket/ImageAuther' }
const FormatDate = require('../../utils/FormatDate')


const findMany = async (req, res) => {
  try {
    const result = await MODEL_AUTHORS.find();
    return res.status(200).json({data: result});
  } catch (error) {
    handleError.ServerError(error, res);
  }
};


const addAuthor = async (req, res) => {
  const dataAuther = req.body.name;
  try {
    const name = await MODEL_AUTHORS.findOne({ name: dataAuther });
    if (name) {
      console.log("tên tác giả tồn tại!!!");
      return res.status(400).send(name);
    }
    const imageUpload = await cloudinary.uploader.upload(req.file?.path, folder);
    const newAuthor = new MODEL_AUTHORS({
      ...req.body, image: { id: imageUpload.public_id, url: imageUpload.secure_url }, createAt: Date.now()
    });
    const book = await MODEL_BOOKS.find({ title: { $in: req.body.book } })
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

}

const Controller = {
  findMany, addAuthor
}

module.exports = Controller