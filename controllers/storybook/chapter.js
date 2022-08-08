const models = require("../../models");
const messages = require("../../constants/messages");
const handleError = require("../../error/HandleError");
const { addDays } = require("../../functions/globalFunc");
const mongoose = require('mongoose');



module.exports = {

  findOneChapter: async (req, res) => {
    try {
      const { chapId } = req.query;
      const result = await models.chapters.aggregate([
        {$match: {deleted: false, _id: new mongoose.Types.ObjectId(chapId)}},
        {$lookup: {
          from: 'comments',
          localField: '_id',
          foreignField: 'chapterId',
          as: 'comments',
          pipeline: [
            {$match: {deleted: false}},
            {$lookup: {
              from: 'comments',
              localField: '_id',
              foreignField: 'commentId',
              as: 'commentsChild',
              pipeline: [
                {$match: {deleted: false}},
                {$project: {userId: 1,reviewId: 1, likes: 1, createAt: 1, content: 1}}
              ]}},
            {$project: {commentsChild: 1, userId: 1,reviewId: 1, likes: 1, createAt: 1, content: 1, countCommentChild: {$size: '$commentsChild'}}}
          ]
        }}
      ])
      return res.status(200).send({success: true, count: result.length, data: result});
    } catch (error) {
      handleError.ServerError(error, res);
    }
  },

  searchChapter: async (req, res) => {
    try {
      const { ebookId, page, orderby } = req.query;
      const pageSize = 12, skip = page ? (parseInt(page) - 1) * pageSize : null
      const select = [
        {$match: {
          ebooks: new mongoose.Types.ObjectId(ebookId),
          deleted: false, 
        }},
        {$lookup: {
          from: 'comments',
          localField: '_id',
          foreignField: 'chapterId',
          as: 'comments',
        }},
        {$project:{name: { $substr: [ "$name", 0, 7 ] }, views: 1, likes: {$size: '$likes'}, comments: {$size: '$comments'}, createAt:1}},
        {$sort:{name: orderby ? 1 : -1}}
      ]
      page && select.push({$skip: skip },{$limit: pageSize })
      const result = await models.chapters.aggregate(select)
      return res.status(200).send({success: true, data: result});
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

}