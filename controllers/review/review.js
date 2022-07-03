const models = require("../../models");
const messages = require("../../constants/messages");
const handleError = require("../../error/HandleError");



// thêm review
const addReview = async (req, res) => {
  const idUser = req.userIsLoggedId;
  // console.log("addReview 1234111111", idUser)

  if (req.body.content.trim().length === 0) {
    res.status(400).send({ message: messages.validateContenComment });
  } else {
    const review = new models.reviews({ ...req.body, users:idUser });
    review.save()
      .then((data) =>
        res.status(200).send({
          data: data,
          status: 200,
          messages: messages.CreateSuccessfully,
        })
      )
      .catch((error) => {
        console.log(`error ${error}`);
        handleError.ServerError(error, res);
      });
  }
};

// update review
const updateReview = async (req, res) => {
  const userId = req.userIsLoggedId.toHexString();
  const userIdBody = req.body.users;
  const reviewId = req.params.id;
  
  const option = { new: true };
  
  if (userId === userIdBody) {
    try {
      const review = { ...req.body, updateAt:Date.now()};
      const result = await models.reviews.findByIdAndUpdate(
        reviewId,
        review, 
        option
      );
      const response = {
        data: result,
        status: 200,
        messages: messages.UpdateSuccessfully,
      };
      return res.status(200).send(response);
    } catch (error) {
      handleError.ServerError(error, res);
    }
  } else {
    return res
      .status(404)
      .send({ messages: "Không thể sửa review của người khác" });
  }
};

//delete review
const deleteReview = async (req, res) => {
  const userId = req.userIsLoggedId.toHexString();
  const userIdBody = req.body.users;
  const reviewId = req.params.id;
  
  const option = { new: true };
  
  if (userId === userIdBody) {
    try {
      const review = { ...req.body, deleteAt:Date.now()};
      const result = await models.reviews.findByIdAndUpdate(
        reviewId,
        review, 
        option
      );
      const response = {
        data: result,
        status: 200,
        messages: messages.UpdateSuccessfully,
      };
      return res.status(200).send(response);
    } catch (error) {
      handleError.ServerError(error, res);
    }
  } else {
    return res
      .status(404)
      .send({ messages: "Không thể xóa review của người khác" });
  }
};


// danh sách review theo mã comic sắp xếp theo ngày
const getAllReviewSort = async (req, res) => {
  const comicId = req.query.idComic;
  const sort = req.query.sortReview;
  const rating = req.query.rating;
  let page = parseInt(req.query.page);
  const PAGE_SIZE = 5;
  page < 0 ? (page = 1) : (page = page);
  const skip = (page - 1) * PAGE_SIZE;

  try {
  
  } catch (error) {
    
  }

  if ( !comicId) {
    return res.status(400).send({ messages: messages.NotFound });
  } else {
    if (page && !sort && !rating) {
      console.log("get all phân trang");
      try {
        const result = await models.reviews.find({ ebooks: comicId , deleted:false})
        .skip(skip)
        .limit(PAGE_SIZE);
      return res.status(200).send({ data: result });
      } catch (error) {
        handleError.ServerError(error, res);
      }
     
    } 
    else if (page && sort && !rating) {
      console.log("Sắp xếp");
      try {
        const result = await models.reviews.find({ ebooks: comicId ,deleted:false})
        .skip(skip)
        .limit(PAGE_SIZE)
        .sort({ createAt: sort === "ASC" ? 1 : -1 });
      return res.status(200).send({ data: result });
      } catch (error) {
        handleError.ServerError(error, res);
      }
     
    } 
    else if (page && rating && sort) {
      console.log(`rating ${rating}`);

      try {
        const result = await models.reviews.find({ ebooks: comicId, deleted:false })
        .skip(skip)
        .limit(PAGE_SIZE)
        .sort({ rating: sort === "ASC" ? 1 : -1 });;
      return res.status(200).send({ data: result });
      } catch (error) {
        handleError.ServerError(error, res);
        
      }
      
    }
    else return res.status(400).send({ messages: messages.NotFound });
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
  deleteReview,
  getAllReviewSort,
};
