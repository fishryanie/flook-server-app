const models = require("../../models");
const messages = require("../../constants/messages");
const handleError = require("../../error/HandleError");



// thêm review
const addReview = async (req, res) => {
  const idUser = req.userIsLoggedId._id;
  // console.log("addReview 1234111111", idUser)

 
    const review = new models.reviews({ ...req.body, users: idUser });
    review.save()
      .then((data) =>
        res.status(200).send({
          data: data,
          success: true,
          message: messages.CreateSuccessfully,
        })
      )
      .catch((error) => {
        handleError.ServerError(error, res);
      });
  
};

// update review
const updateReview = async (req, res) => {
 
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
  
};

//remove one review
const removeOneReview = async (req, res) => {

  // console.log("🚀 ~ file: review.js ~ line 73 ~ find ~ find", find)
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

};

//remove all review
const removeManyReview = async (req, res) => {
  const listReviewId = req.body.listReviewId;
  const option = { new: true };
    try {
      const result = await models.reviews.updateMany(
        { "_id": { $in: listReviewId } }, 
        { $set: { deleted: true, deleteAt: Date.now() } },
        option
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
 
};


//delete one review
const deleteOneReview = async (req, res) => {
  
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
};

//delete many review
const deleteManyReview = async (req, res) => {
 
    try {
      const listReviewId = req.body.listReviewId;
      const result = await models.reviews.deleteMany({ "_id":{ $in: listReviewId }});

      if(result.deletedCount === 0 ) {
        return res.status(400).send({ success: false,message: messages.DeleteNotSuccessfully})
      }

      const response = {
        data: result,
        success: true,
        message: messages.DeleteSuccessfully,
      };
      return res.status(200).send(response);
    } catch (error) {
      handleError.ServerError(error, res);
    }
 
};


// danh sách review theo mã comic sắp xếp theo ngày
const getAllReviewSort = async (req, res) => {

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

    const resultRating = await models.reviews.find({ ebooks: comicId, deleted: false })
    const lenghtRating = resultRating.length
    let total = 0
        for(let i =0; i < lenghtRating; i++){
        total += resultRating[i].rating
    }
    let averageRating = total/lenghtRating
  

    if (page && !sort && !rating) {
     
      try {
        const result = await models.reviews.find({ ebooks: comicId, deleted: false })
          .skip(skip)
          .limit(PAGE_SIZE)
          .sort({"createAt": -1})
        return res.status(200).send({ data: {result,averageRating }, susscess:true, massage:messages.GetDataSuccessfully });
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
        return res.status(200).send({ data: {result,averageRating}, susscess:true, massage:messages.GetDataSuccessfully  });
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
        return res.status(200).send({ data:  {result, averageRating} ,susscess:true, massage:messages.GetDataSuccessfully});
      } catch (error) {
        handleError.ServerError(error, res);
      }

    }
    else return res.status(400).send({ susscess:false,messages: messages.NotFound });
  }
  } catch (error) {
    handleError.ServerError(error, res);
  }
};

// Like, disLikes and unlike, undislike
// const likeAndDislike = async (req, res) => {
//   const like = req.params.likeAndDislike;
//   const commentId = req.params.id;
//   if (!like || !commentId) {
//     return res.status(400).send({ messages: messages.NotFound });
//   }
//   if (like === "like") {
//     console.log(req.body.likes);
//     try {
//       const result = await models.comments.updateOne(
//         { _id: commentId },
//         {
//           $addToSet: {
//             likes: req.body.likes,
//           },
//         }
//       );
//       result.modifiedCount === 0
//         ? res.status(400).send({ messages: "Bạn đã like" })
//         : res.status(200).send({ data: result, messages: "Like successfully" });
//     } catch (error) {
//       handleError.ServerError(error, res);
//       console.log(`error ${error}`);
//     }
//   } else if (like === "dislike") {
//     console.log(req.body.likes);
//     try {
//       const result = await models.comments.updateOne(
//         { _id: commentId },
//         {
//           $addToSet: {
//             disLikes: req.body.disLikes,
//           },
//         }
//       );
//       result.modifiedCount === 0
//         ? res.status(400).send({ messages: "Bạn đã dislike" })
//         : res
//             .status(200)
//             .send({ data: result, messages: "Dislike successfully" });
//     } catch (error) {
//       handleError.ServerError(error, res);
//     }
//   } else if (like === "unlike") {
//     console.log(req.body.likes);
//     try {
//       const result = await models.comments.updateOne(
//         { _id: commentId },

//         { $pull: { likes: req.body.likes } }
//       );
//       if (result.modifiedCount === 0) {
//         return res.status(404).send({ messages: "Không tìm thấy id" });
//       }
//       return res
//         .status(200)
//         .send({ data: result, messages: "unlike successfully" });
//     } catch (error) {
//       handleError.ServerError(error, res);
//     }
//   } else {
//     console.log(req.body.likes);
//     try {
//       const result = await models.comments.updateOne(
//         { _id: commentId },

//         { $pull: { disLikes: req.body.disLikes } }
//       );
//       if (result.modifiedCount === 0) {
//         return res.status(404).send({ messages: "Không tìm thấy id" });
//       }

//       return res.status(200).send({ messages: "undislike successfully" });
//     } catch (error) {
//       handleError.ServerError(error, res);
//     }
//   }
// };
module.exports = {
  addReview,
  updateReview,
  removeOneReview,
  removeManyReview,
  deleteOneReview,
  deleteManyReview,
  getAllReviewSort
 
};
