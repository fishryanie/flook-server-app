const models = require("../../models");
const messages = require("../../constants/messages");
const handleError = require("../../error/HandleError");

module.exports = {

  findOneReview: (req, res) => {
    
  },

  findManyReview: async (req, res) => {
    const populate = ['users', 'ebooks']
    try {
      Promise.all([
        models.reviews.find({ deleted: false }).populate(populate),
        models.reviews.find().count()
      ]).then((result) => {
        return res.status(200).send({data: result[0], count: result[1], success: true, message: messages.FindSuccessfully});
      })
    } catch (error) {
      return handleError.ServerError(error, res);
    }
  },

  insertOneReview: async (req, res) => {
    try {
      const userId = req.userIsLogged._id.toString();
      console.log('userId', userId)
      const review = new models.reviews({ ...req.body }).save();
      review && res.status(200).send({data: review, success: true, message: messages.InsertSuccessfully})
    } catch (error) {
      return handleError.ServerError(error, res)
    }
  },

  updateOneReview: async (req, res) => {
    try {
      const user = req.userIsLogged;
      const reviewId = req.query.id;
      const option = { new: true };
      let find
      for (const role of user.roles) {
        if (role.name == "Moderator" || role.name == "Admin") {
          find = { _id: reviewId }
          break;
        } else {
          find = { _id: reviewId, users: user }
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
        return res.status(400).send({ success: false,message: messages.UpdateFail});
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
        return res.status(400).send({ success: false,message: messages.RemoveFail});
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
      const user = req.userIsLogged;
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
        return res.status(400).send({ success: false,message: messages.RemoveFail});
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
    const listReviewId  = req.body
    try {
      const result = await models.reviews.updateMany(
        { "_id": { $in: listReviewId } }, 
        { $set: { deleted: true, deleteAt: Date.now() } },
        { new: true }
      );
      if(!result){
        return res.status(400).send({ success: false,message: messages.RemoveFail});
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

  searchReview: async (req, res) =>{
    try {
      const comicId = req.query.idComic;
      const sort = req.query.sortReview;
      const rating = req.query.rating;
      let page = parseInt(req.query.page);
      const PAGE_SIZE = 10;
      page < 0 ? (page = 1) : (page = page);
      const skip = (page - 1) * PAGE_SIZE;
    
      if (!comicId) {
        return res.status(400).send({ messages: messages.NotFound });
      } else {
        if (page && !sort && !rating) {
          console.log("get all phân trang");
          try {
            const result = await models.reviews.find({ ebooks: comicId, deleted: false })
              .skip(skip)
              .limit(PAGE_SIZE);
            return res.status(200).send({ data: result, susscess:true, massage:messages.GetDataSuccessfully });
          } catch (error) {
            handleError.ServerError(error, res);
          }
    
        }
        else if (page && sort && !rating) {
         
          try {
            const result = await models.reviews.find({ ebooks: comicId, deleted: false })
              .skip(skip)
              .limit(PAGE_SIZE)
              .sort({ createAt: sort === "ASC" ? 1 : -1 });
            return res.status(200).send({ data: result, susscess:true, massage:messages.GetDataSuccessfully  });
          } catch (error) {
            handleError.ServerError(error, res);
          }
    
        }
        else if (page && rating && sort) {
          // console.log(`rating ${rating}`);
    
          try {
            const result = await models.reviews.find({ ebooks: comicId, deleted: false })
              .skip(skip)
              .limit(PAGE_SIZE)
              .sort({ rating: sort === "ASC" ? 1 : -1 });;
            return res.status(200).send({ data: result ,susscess:true, massage:messages.GetDataSuccessfully});
          } catch (error) {
            handleError.ServerError(error, res);
          }
    
        }
        else return res.status(400).send({ susscess:false,messages: messages.NotFound });
      }
      } catch (error) {
        handleError.ServerError(error, res);
      }
  }
 
};
