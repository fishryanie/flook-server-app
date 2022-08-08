const cloudinary = require('../../configs/cloudnary');
const models = require("../../models");
const messages = require("../../constants/messages");
const folder = { folder: 'Flex-ticket/ImageChapter' }
const handleError = require("../../error/HandleError");



module.exports = {

  findOneChapter: async (req, res) => {
    const id = req.query.id;
    try {
      const result = await models.chapters.findById(id).populate('ebooks');
      return res.status(200).send(result)
    } catch (error) {
      handleError.ServerError(error, res);
    }
  },

  findManyChapter: async (req, res) => {
    const populate = ['numLikes', 'ebooks']
    try {
      Promise.all([
        models.chapters.find({ deleted: { $in: false } }).populate(populate),
        models.chapters.find({ deleted: { $in: false } }).count()
      ]).then((result) => {
        return res.status(200).send({ data: result[0], count: result[1], success: true, message: messages.FindSuccessfully });
      })
    } catch (error) {
      handleError.ServerError(error, res);
    }
  },

  insertOneChapter: async (req, res) => {
    try {
      const itemTrash = req.body.ebooks.pop();
      const data = req.body;

      const imageUpload = await cloudinary.uploader.upload(req.file?.path, folder);

      const result = await new models.chapters({ ...data, images: { url: imageUpload.secure_url, id: imageUpload.public_id } }).save();
      // console.log("result", result._id)

      if (result) {
        console.log("result")
        const update = await models.chapters.updateOne(
          { name: result._id },
          { $inc: { "images.number": 1 } }
        )
        if (update) {
          return res.status(200).send({ data: result, success: true, message: messages.InsertSuccessfully })
        }
        return res.status(400).send({ message: messages.InsertFail })
      }
      return res.status(400).send({ message: messages.InsertFail })

    } catch (error) {
      handleError.ServerError(error, res);
    }
  },


  insertManyChapter: async (req, res) => {

  },

  updateOneChapter: async (req, res) => {
    const id = req.query.id;
    const itemTrash = req.body.ebooks.pop()
    const image = req.body.images;
    console.log('body', req.body);
    const option = { new: true };
    let imageUpload
    try {
      const chapterFind = await models.chapters.findById(id);
      if (req.file) {
        await cloudinary.uploader.destroy(chapterFind.images.id);
        imageUpload = await cloudinary.uploader.upload(req.file?.path, folder);
      } else {
        imageUpload = await cloudinary.uploader.upload(image, folder);
        await cloudinary.uploader.destroy(chapterFind.images.id);
      }

      const updateChapter = new models.chapters({
        ...req.body, images: { url: imageUpload.secure_url, id: imageUpload.public_id }
      });

      const result = await models.chapters.findByIdAndUpdate(id, updateChapter, option);

      if (!result) {
        return handleError.NotFoundError(id, res)
      }
      return res.status(200).send({ message: messages.UpdateSuccessfully, data: result });
    } catch (error) {
      return handleError.ServerError(error, res)
    }
  },

  deleteOneChapter: async (req, res) => {

  },

  deleteManyChapter: async (req, res) => {

  },

  removeOneChapter: async (req, res) => {
    const option = { new: true };
    const id = req.query.id;
    const chapterFind = await models.chapters.findById(id);
    let row;

    try {

      if (chapterFind.deleted === true) {
        row = await models.chapters.findByIdAndUpdate(id, { deleted: false, deleteAt: "", updateAt: chapterFind.updateAt, createAt: chapterFind.createAt }, option);
      } else {
        row = await models.chapters.findByIdAndUpdate(id, { deleted: true, deleteAt: FormatDate.addDays(0), updateAt: chapterFind.updateAt, createAt: chapterFind.createAt }, option);
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

  removeManyChapter: async (req, res) => {
    const listDelete = req.body;
    const option = { new: true };
    console.log('removeManyChapter', listDelete)
    try {
      const result = await models.chapters.updateMany(
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

  searchChapter: async (req, res) => {
    const ebookId = req.query.id;

    const PAGE_SIZE = 10;
    let page = parseInt(req.query.page);
    const sort = req.query.sort;

    page < 0 ? (page = 1) : (page = page);
    const skip = (page - 1) * PAGE_SIZE;

    try {
      const sortChapter = sort === 'name' ? { name: 1 } : null;

      const count = await models.chapters.find({ ebooks: ebookId }).count();

      const result = await models.chapters.find({ ebooks: { $eq: ebookId } })
        .populate('ebooks')
        .skip(skip)
        .limit(PAGE_SIZE)
        .sort(sortChapter);

      return res.status(200).send({ data: result, count: count, success: true, message: messages.FindSuccessfully })
    } catch (error) {
      handleError.ServerError(error, res);
    }
  }
}