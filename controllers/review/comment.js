const models = require("../../models");
const messages = require("../../constants/messages");
const handleError = require("../../error/HandleError");



// thêm bình luận
const addComment = async (req, res) => {
  const idUser = req.userIsLoggedId._id;
  // console.log("addReview 1234111111", idUser)

  if (req.body.content.trim().length === 0) {
    res.status(400).send({ success: false, message: messages.validateContenComment });
  } else {
    const comment = new models.comments({ ...req.body, userId: idUser });
    comment.save()
      .then((data) =>
        res.status(200).send({
          data: data,
          success: true,
          message: messages.CreateSuccessfully,
        })
      )
      .catch((error) => {
        // console.log(`error ${error}`);
        handleError.ServerError(error, res);
      });
  }
};

// update bình luận
const updateComment = async (req, res) => {

  try {
    const user = req.userIsLoggedId;
    const commentId = req.query.id;
    const option = { new: true };

    let find
    for (const role of user.roles) {
      if (role.name == "Moderator" || role.name == "Admin") {
        find = { _id: commentId }
        break;
      } else {
        find = { _id: commentId, userId: user._id }
        break;
      }
    }
    if (req.body.content.trim().length === 0) {
      return res.status(400).send({ success: false, message: messages.validateContenComment });
    } else {
      const comment = { ...req.body, updateAt: Date.now() };

      const result = await models.comments.findOneAndUpdate(
        find,
        comment,
        option
      );

      if (!result) {
        return res.status(400).send({ success: false, message: messages.UpdateNotSuccessfully });
      }
      const response = {
        data: result,
        success: true,
        message: messages.UpdateSuccessfully,
      };
      return res.status(200).send(response);
    }
  } catch (error) {
    handleError.ServerError(error, res);
  }
};


//remove one comment
const removeOneComment = async (req, res) => {
  const user = req.userIsLoggedId;
  const commentId = req.query.id;
  const option = { new: true };
  let find
  for (const role of user.roles) {
    if (role.name == "Moderator" || role.name == "Admin") {
      find = { _id: commentId }
      break;
    } else {
      find = { _id: commentId, userId: user._id }
      break;
    }
  }
  // console.log("🚀 ~ file: review.js ~ line 73 ~ find ~ find", find)
  try {
    const comment = { deleted: true, deleteAt: Date.now() };
    const result = await models.comments.findOneAndUpdate(find, comment, option);
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

};

//remove many comment
const removeManyComment = async (req, res) => {
  const listCommentId = req.body.listCommentId;
  const option = { new: true };
  try {
    const result = await models.comments.updateMany(
      { "_id": { $in: listCommentId } },
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

};



//delete one review
const deleteOneComment = async (req, res) => {

  try {
    const commentId = req.query.id;
    const result = await models.comments.deleteOne({ _id: commentId });


    if (result.deletedCount === 0) { return res.status(400).send({ success: false, message: messages.DeleteNotSuccessfully }); }

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
const deleteManyComment = async (req, res) => {

  try {
    const listCommentId = req.body.listCommentId;
    const result = await models.comments.deleteMany({ "_id": { $in: listCommentId } });
    if (result.deletedCount === 0) {
      return res.status(400).send({ success: false, message: messages.DeleteNotSuccessfully });
    }
    const response = {
      status: 200,
      message: messages.DeleteSuccessfully,
    };
    return res.status(200).send(response);
  } catch (error) {
    handleError.ServerError(error, res);
  }

};

// Like và hủy like
const likeAndUnlike = async (req, res) => {
  try {
    const user = req.userIsLoggedId;
    const commentId = req.query.id;
    if (!commentId) {
      return res.status(400).send({ messages: messages.NotFound });
    }
    const getComment = await models.comments.findById(commentId)
    const listUserLike = getComment.likes
    let isUserLiked;
    for(let i = 0; i < listUserLike.length; i++ ){
      if(user._id.toHexString() == listUserLike[i].toHexString()){
        isUserLiked = true
        break;
      }
      isUserLiked = false
    }
  
    let condition = {}
      if(!isUserLiked){
        condition={
          $push:{likes:user._id}
        }
      }else{
        condition={
          $pull: {likes:user._id}
        }
      }

    const result = await models.comments.updateOne({ _id: commentId },condition);
    if(result.modifiedCount === 0){
    return res.status(400).send({success:false, message:messages.NotSuccessfully})
    }
    return res.status(200).send({success:true, message:messages.Successfully})
    
  } catch (error) {
    handleError.ServerError(error, res);
    console.log(`error ${error}`);
    
  }
};


// danh sách bình luận theo mã idreview, idcomment, idchapter
const getComment = async (req, res) => {
  // console.log("get comment");
  try {
    const id = req.query.id;
    const typeId = req.query.type
    let page = parseInt(req.query.page);

    const PAGE_SIZE = 10;
    page < 0 ? (page = 1) : (page = page);
    const skip = (page - 1) * PAGE_SIZE;

    if (!id) {
      return res.status(400).send({ messages: messages.NotFound });
    } else {
      if (page) {
        try {
          const result = await models.comments.find({ deleted: false, [typeId]:id })
            .skip(skip)
            .limit(PAGE_SIZE)
            .sort({"createAt": -1})
          return res.status(200).send({ data: result, susscess:true, massage:messages.GetDataSuccessfully });
        } catch (error) {
          handleError.ServerError(error, res);
          console.log("Vào đây");
        }
      }
      else return res.status(400).send({ susscess:false,messages: messages.NotFound });
    }
    } catch (error) {
      handleError.ServerError(error, res);
    }
}




// const getAllCommentSort = async (req, res) => {
//   const id = req.query.id;
//   const sort = req.query.sortComment;
//   const rating = req.query.rating;
//   const like = req.query.like;
//   let page = parseInt(req.query.page);
//   const PAGE_SIZE = 5;
//   page < 0 ? (page = 1) : (page = page);
//   const skip = (page - 1) * PAGE_SIZE;
//   if (!movieId) {
//     return res.status(400).send({ messages: messages.NotFound });
//   } else {
//     if (page && !sort) {
//       console.log("get all phân trang");
//       const result = await models.comments.find({ idMovie: movieId })
//         .populate(["idMovie", "likes", "disLikes"])
//         .skip(skip)
//         .limit(PAGE_SIZE);
//       return res.status(200).send({ data: result });
//     } else if (page && sort) {
//       console.log("Sắp xếp");
//       const result = await models.comments.find({ idMovie: movieId })
//         .populate(["idMovie", "likes", "disLikes"])
//         .skip(skip)
//         .limit(PAGE_SIZE)
//         .sort({ createAt: sort === "ASC" ? 1 : -1 });
//       return res.status(200).send({ data: result });
//     } else if (rating) {
//       console.log(`rating ${rating}`);
//       const result = await models.comments.find({ idMovie: movieId, rating })
//         .populate(["idMovie", "likes", "disLikes"])
//         .limit(10);
//       return res.status(200).send({ data: result });
//     } else {
//       console.log(`like ${like}`);
//       let result = await models.comments.find({ idMovie: movieId }).populate([
//         "idMovie",
//         "likes",
//         "disLikes",
//       ]);
//       result = result.sort((a, b) => b.likes.length - a.likes.length);

//       let ketqua = [];
//       for (let i = 0; i < 2; i++) {
//         ketqua.push(result[i]);
//       }
//       return res.status(200).send({ data: ketqua });
//     }
//   }
// };
module.exports = {
  addComment,
  updateComment,
  removeOneComment,
  removeManyComment,
  likeAndUnlike,
  deleteOneComment,
  deleteManyComment,
  getComment,
};
