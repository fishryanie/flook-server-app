const models = require("../../models");
const mongoose = require('mongoose');
const messages = require("../../constants/messages");
const handleError = require("../../error/HandleError");

module.exports = {

  findOneReview: (req, res) => {
    
  },
  searchReview: async (req, res) =>{
    try {
      console.log('SEARCH REVIEW',req.query.ebookId)
      const result = await models.reviews.aggregate([
        {$match: {deleted: false, 'ebooks': new mongoose.Types.ObjectId(req.query.ebookId) }},
        {$lookup: {
          from: 'comments',
          localField: '_id',
          foreignField: 'reviewId',
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
          ]}},
          // {$lookup: {
          //   from: 'users',
          //   localField: '_id',
          //   foreignField: 'users',
          //   as: 'users',}},

      ])
      if(!result){
       return res.status(400).send({success: false, message:messages.GetDataNotSuccessfully});
      }
       return res.status(200).send({success: true, countReview: result.length, data: result, message:messages.GetDataSuccessfully});
    } catch (error) {
      return handleError.ServerError(error, res)
    }
   

  },

  findManyReview: async (req, res) => {
    const populate = ['users', 'ebooks']
    try {
      Promise.all([
        models.reviews.find({ deleted: false }).populate(populate),
        models.reviews.find({ deleted: false }).count()
      ]).then((result) => {
        return res.status(200).send({data: result[0], count: result[1], success: true});
      })
    } catch (error) {
      return handleError.ServerError(error, res);
    }
  },

  insertOneReview: async (req, res) => {
    try {
      const idUser = req.userIsLoggedId._id;
      const review = new models.reviews.create({ ...req.body, users: idUser })
      review && res.status(200).send({data: data, success: true, message: messages.CreateSuccessfully})
    } catch (error) {
      return handleError.ServerError(error, res)
    }
  },

  updateOneReview: async (req, res) => {
    try {
      const user = req.userIsLoggedId;
      const reviewId = req.query.id;
      const option = { new: true };
      let find
      for (const role of user.roles) {
        if (role.name == "Moderator" || role.name == "Admin") {
          find = { _id: reviewId }
          break;
        } else {
          find = { _id: reviewId, users: user._id }
          break;
        }
      }
    
      const review = { ...req.body, updateAt: Date.now() };
      const result = await models.reviews.findOneAndUpdate(
        find,
        review,
        option
      );
      if(!result) {
        return res.status(400).send({ success: false,message: messages.UpdateNotSuccessfully});
      }
      const response = {
        data: result,
        success:true,
        message: messages.UpdateSuccessfully,
      };
      return res.status(200).send(response);
    } catch (error) {
      handleError.ServerError(error, res);
    }
  },

  insertManyReview: async (req, res) => {},

  deleteOneReview: async (req, res) => {
    try {
      const reviewId = req.query.id;
      const result = await models.reviews.deleteOne({_id:reviewId});
      if(result.deletedCount === 0) {
        return res.status(400).send({ success: false,message: messages.DeleteNotSuccessfully});}
      const response = {
        success: true,
        message: messages.DeleteSuccessfully,
      };
      return res.status(200).send(response);
    
    } catch (error) {
      handleError.ServerError(error, res);
    }
  },

  deleteManyReview: async (req, res) => {
    const listReviewId = req.body.listReviewId;
    try {
      const result = await models.reviews.updateMany(
        { "_id": { $in: listReviewId } }, 
        { $set: { deleted: true, deleteAt: Date.now() } },
        { new: true }
      );
      if(!result){
        return res.status(400).send({ success: false,message: messages.RemoveNotSuccessfully});
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

  removeOneReview: async (req, res) => {
    try {
      const user = req.userIsLoggedId;
      const reviewId = req.query.id;
      const option = { new: true };
      let find
      for (const role of user.roles) {
        if (role.name == "Moderator" || role.name == "Admin") {
          find = { _id: reviewId }
          break;
        } else {
          find = { _id: reviewId, users: user._id }
          break;
        }
      }
      const review = { deleted:true, deleteAt:Date.now()};
      const result = await models.reviews.findOneAndUpdate(find,review, option);
      if(!result) {
        return res.status(400).send({ success: false,message: messages.RemoveNotSuccessfully});
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

  removeManyReview: async (req, res) => {
    const { listReviewId } = req.body
    try {
      const result = await models.reviews.updateMany(
        { "_id": { $in: listReviewId } }, 
        { $set: { deleted: true, deleteAt: Date.now() } },
        { new: true }
      );
      if(!result){
        return res.status(400).send({ success: false,message: messages.RemoveNotSuccessfully});
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

  // searchReview: async (req, res) =>{
  //   try {
  //     const comicId = req.query.idComic;
  //     const sort = req.query.sortReview;
  //     const rating = req.query.rating;
  //     let page = parseInt(req.query.page);
  //     const PAGE_SIZE = 10;
  //     page < 0 ? (page = 1) : (page = page);
  //     const skip = (page - 1) * PAGE_SIZE;
    
  //     if (!comicId) {
  //       return res.status(400).send({ messages: messages.NotFound });
  //     } else {
  //       if (page && !sort && !rating) {
  //         console.log("get all phân trang");
  //         try {
  //           const result = await models.reviews.find({ ebooks: comicId, deleted: false })
  //             .skip(skip)
  //             .limit(PAGE_SIZE);
  //           return res.status(200).send({ data: result, susscess:true, massage:messages.GetDataSuccessfully });
  //         } catch (error) {
  //           handleError.ServerError(error, res);
  //         }
    
  //       }
  //       else if (page && sort && !rating) {
         
  //         try {
  //           const result = await models.reviews.find({ ebooks: comicId, deleted: false })
  //             .skip(skip)
  //             .limit(PAGE_SIZE)
  //             .sort({ createAt: sort === "ASC" ? 1 : -1 });
  //           return res.status(200).send({ data: result, susscess:true, massage:messages.GetDataSuccessfully  });
  //         } catch (error) {
  //           handleError.ServerError(error, res);
  //         }
    
  //       }
  //       else if (page && rating && sort) {
  //         // console.log(`rating ${rating}`);
    
  //         try {
  //           const result = await models.reviews.find({ ebooks: comicId, deleted: false })
  //             .skip(skip)
  //             .limit(PAGE_SIZE)
  //             .sort({ rating: sort === "ASC" ? 1 : -1 });;
  //           return res.status(200).send({ data: result ,susscess:true, massage:messages.GetDataSuccessfully});
  //         } catch (error) {
  //           handleError.ServerError(error, res);
  //         }
    
  //       }
  //       else return res.status(400).send({ susscess:false,messages: messages.NotFound });
  //     }
  //     } catch (error) {
  //       handleError.ServerError(error, res);
  //     }
  // }
 
};
