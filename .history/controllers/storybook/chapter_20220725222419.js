const models = require("../../models");
const messages = require("../../constants/messages");
const handleError = require("../../error/HandleError");
const { addDays } = require("../../functions/globalFunc");



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
        return res.status(200).send({ data: result[0], count: result[1], success: true });
      })
    } catch (error) {
      handleError.ServerError(error, res);
    }
  },

  insertOneChapter: async (req, res) => {
    try {
      const data = req.body;
  
      const result = await new models.chaptercomics({ ...data }).save();
      // console.log("result", result._id)
  
      if (result) {
        console.log("result")
        const update = await models.chaptercomics.updateOne(
          { name: result._id },
          { $inc: { "image.number": 1 } }
        )
        if (update) {
          return res.status(200).send({ data: result, messages: true })
        }
        return res.status(400).send({ messages: true })
      }
      return res.status(400).send({ messages: true })
  
    } catch (error) {
      handleError.ServerError(error)
    }
  },


  insertManyChapter: async (req, res) => {

  },

  updateOneChapter: async (req, res) => {

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
        row = await models.chapters.findByIdAndUpdate(id, { deleted: false, deleteAt: null, updateAt: chapterFind.updateAt, createAt: chapterFind.createAt }, option);
      } else {
        row = await models.chapters.findByIdAndUpdate(id, { deleted: true, deleteAt: addDays(0), updateAt: chapterFind.updateAt, createAt: chapterFind.createAt }, option);
      }
      if (!row) {
       return handleError.NotFoundError(id, res)
      }
      return res.status(200).send({success:true, message: messages.DeleteSuccessfully });
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
        { $set: { deleted: true, deleteAt: addDays(0) } },
        option
      );
      if (!result) {
        return res.status(400).send({ success: false, message: messages.RemoveNotSuccessfully });
      }
      return res.status(200).send({success:true, message: messages.DeleteSuccessfully });
    } catch (error) {
      return handleError.ServerError(error, res);
    }
  },

  searchChapter: async (req, res) =>{
    const comicId = req.params.mangaId;

    const PAGE_SIZE = 10;
    let page = parseInt(req.query.page);
    const sort = req.query.sort;

    page < 0 ? (page = 1) : (page = page);
    const skip = (page - 1) * PAGE_SIZE;

    try {
      const sortChapter = sort === 'name' ? { name: 1 } : null;

      const count = await models.chapters.find({ book: comicId }).count();
      // console.log(count)

      const result = await models.chapters.find({ book: { $eq: comicId } })
        // .populate('book')
        .skip(skip)
        .limit(PAGE_SIZE)
        .sort(sortChapter);

      // const sort1 = result[0].image;
      // console.log("sort1", sort1)

      return res.status(200).send({ data: result, count: count, message: 'Success' })
    } catch (error) {
      handleError.ServerError(error, res);
    }
  }
}