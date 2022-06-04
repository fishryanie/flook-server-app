const cloudinary = require('../../configs/cloudnary')
const models = require("../../models");
const handleError = require("../../error/HandleError");
const messages = require("../../constants/messages");
const folder = { folder: 'Flex-ticket/ImageAuther' }
const FormatDate = require('../../functions/FormatDate')


const findMany = async (req, res) => {
  try {
    Promise.all([
      models.authors.find(),
      models.authors.find().count()
    ]).then((result) => {
      return res.status(200).send({data: result[0], count: result[1], success: true});
    })
  } catch (error) {
    handleError.ServerError(error, res);
  }
};


const addAuthor = async (req, res) => {
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

}

const Controller = {
  findMany, addAuthor
}

module.exports = Controller