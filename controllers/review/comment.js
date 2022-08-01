const models = require("../../models");
const messages = require("../../constants/messages");
const handleError = require("../../error/HandleError");



// thêm bình luận
const insertOneComment = async (req, res) => {
  const idUser = req.userId;

  if (req.body.content.trim().length === 0) {
    res.status(400).send({ message: messages.validateContenComment });
  } else {
    const Comment = new models.comments({ ...req.body, idUser });
    Comment.save()
      .then((data) =>
        res.status(200).send({
          data: data,
          status: 200,
          message: messages.InsertSuccessfully,
        })
      )
      .catch((error) => {
        console.log(`error ${error}`);
        handleError.ServerError(error, res);
      });
  }
};
// update bình luận
const updateComment = async (req, res) => {
  const commentUserId = req.userId;
  const commentUserIdBody = req.body.idUser;
  const like = req.params.likeordislike;
  const commentId = req.params.id;
  const option = { new: true };

  if (commentUserId === commentUserIdBody) {
    try {
      const Comment = new models.comments({ ...req.body, _id: commentId });
      const result = await models.comments.findByIdAndUpdate(
        commentId,
        Comment,
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
      .send({ messages: "Không thể sửa comment của người khác" });
  }
};
//delete Comment
const deleteComment = async (req, res) => {
  const id = req.params.id;
  const commentUserId = req.userId;
  const commentUserIdBody = req.body.idUser;

  try {
    if (commentUserId === commentUserIdBody) {
      const row = await models.comments.findByIdAndRemove(id).exec();
      if (!row) {
        handleError.NotFoundError(id, res);
      }
      console.log(messages.DeleteSuccessfully);
      return res.status(200).send({ messages: messages.DeleteSuccessfully });
    } else {
      return res
        .status(404)
        .send({ messages: "Không thể xóa comment của người khác" });
    }
  } catch (error) {
    handleError.ServerError(error, res);
    console.log(error);
  }
};

// Like, disLikes and unlike, undislike
const likeAndDislike = async (req, res) => {
  const like = req.params.likeAndDislike;
  const commentId = req.params.id;
  if (!like || !commentId) {
    return res.status(400).send({ messages: messages.NotFound });
  }
  if (like === "like") {
    console.log(req.body.likes);
    try {
      const result = await models.comments.updateOne(
        { _id: commentId },
        {
          $addToSet: {
            likes: req.body.likes,
          },
        }
      );
      result.modifiedCount === 0
        ? res.status(400).send({ messages: "Bạn đã like" })
        : res.status(200).send({ data: result, messages: "Like successfully" });
    } catch (error) {
      handleError.ServerError(error, res);
      console.log(`error ${error}`);
    }
  } else if (like === "dislike") {
    console.log(req.body.likes);
    try {
      const result = await models.comments.updateOne(
        { _id: commentId },
        {
          $addToSet: {
            disLikes: req.body.disLikes,
          },
        }
      );
      result.modifiedCount === 0
        ? res.status(400).send({ messages: "Bạn đã dislike" })
        : res
          .status(200)
          .send({ data: result, messages: "Dislike successfully" });
    } catch (error) {
      handleError.ServerError(error, res);
    }
  } else if (like === "unlike") {
    console.log(req.body.likes);
    try {
      const result = await models.comments.updateOne(
        { _id: commentId },

        { $pull: { likes: req.body.likes } }
      );
      if (result.modifiedCount === 0) {
        return res.status(404).send({ messages: "Không tìm thấy id" });
      }
      return res
        .status(200)
        .send({ data: result, messages: "unlike successfully" });
    } catch (error) {
      handleError.ServerError(error, res);
    }
  } else {
    console.log(req.body.likes);
    try {
      const result = await models.comments.updateOne(
        { _id: commentId },

        { $pull: { disLikes: req.body.disLikes } }
      );
      if (result.modifiedCount === 0) {
        return res.status(404).send({ messages: "Không tìm thấy id" });
      }

      return res.status(200).send({ messages: "undislike successfully" });
    } catch (error) {
      handleError.ServerError(error, res);
    }
  }
};
// danh sách bình luận theo mã phim sắp xếp theo ngày
const getAllCommentSort = async (req, res) => {
  const movieId = req.query.idMovie;
  const sort = req.query.sortComment;
  const rating = req.query.rating;
  const like = req.query.like;
  let page = parseInt(req.query.page);
  const PAGE_SIZE = 5;
  page < 0 ? (page = 1) : (page = page);
  const skip = (page - 1) * PAGE_SIZE;
  if (!movieId) {
    return res.status(400).send({ messages: messages.NotFound });
  } else {
    if (page && !sort) {
      console.log("get all phân trang");
      const result = await models.comments.find({ idMovie: movieId })
        .populate(["idMovie", "likes", "disLikes"])
        .skip(skip)
        .limit(PAGE_SIZE);
      return res.status(200).send({ data: result });
    } else if (page && sort) {
      console.log("Sắp xếp");
      const result = await models.comments.find({ idMovie: movieId })
        .populate(["idMovie", "likes", "disLikes"])
        .skip(skip)
        .limit(PAGE_SIZE)
        .sort({ createAt: sort === "ASC" ? 1 : -1 });
      return res.status(200).send({ data: result });
    } else if (rating) {
      console.log(`rating ${rating}`);
      const result = await models.comments.find({ idMovie: movieId, rating })
        .populate(["idMovie", "likes", "disLikes"])
        .limit(10);
      return res.status(200).send({ data: result });
    } else {
      console.log(`like ${like}`);
      let result = await models.comments.find({ idMovie: movieId }).populate([
        "idMovie",
        "likes",
        "disLikes",
      ]);
      result = result.sort((a, b) => b.likes.length - a.likes.length);

      let ketqua = [];
      for (let i = 0; i < 2; i++) {
        ketqua.push(result[i]);
      }
      return res.status(200).send({ data: ketqua });
    }
  }
};

module.exports = {
  insertOneComment,
  updateComment,
  likeAndDislike,
  deleteComment,
  getAllCommentSort,

  findOneComment: (req, res) => {

  },

  findManyComment: async (req, res) => {
    const populate = ['userId', 'reviewId', 'commentId', 'chapterId']
    try {
      Promise.all([
        models.comments.find({ deleted: false }).populate(populate),
        models.comments.find().count()
      ]).then((result) => {
        return res.status(200).send({ data: result[0], count: result[1], success: true });
      })
    } catch (error) {
      return handleError.ServerError(error, res);
    }
  },

  insertOneComment: async (req, res) => {
    try {
      const userId = req.userIsLogged._id.toString();
      console.log('userId', userId)
      const comment = new models.comments({ ...req.body }).save();
      comment && res.status(200).send({ data: comment, success: true, message: messages.InsertSuccessfully })
    } catch (error) {
      return handleError.ServerError(error, res)
    }
  },

  insertManyComment: async (req, res) => {

  },

  updateOneComment: async (req, res) => {
    try {
      const user = req.userIsLogged;
      const commentId = req.query.id;
      const option = { new: true };
      let find
      for (const role of user.roles) {
        if (role.name == "Moderator" || role.name == "Admin") {
          find = { _id: commentId }
          break;
        } else {
          find = { _id: commentId, users: user }
          break;
        }
      }
    
      const comment = { ...req.body, updateAt: Date.now() };
      const result = await models.comments.findOneAndUpdate(
        find,
        comment,
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

  deleteOneComment: async (req, res) => {

  },

  deleteManyComment: async (req, res) => {

  },

  removeOneComment: async (req, res) => {
    try {
      const user = req.userIsLogged;
      const commentId = req.query.id;
      console.log(user)
      const option = { new: true };
      let find
      for (const role of user.roles) {
        if (role.name == "Moderator" || role.name == "Admin") {
          find = { _id: commentId }
          break;
        } else {
          find = { _id: commentId, users: user._id }
          break;
        }
      }
      const comment = { deleted: true, deleteAt: Date.now() };
      const result = await models.comments.findOneAndUpdate(find, comment, option);
      if (!result) {
        return res.status(400).send({ success: false, message: messages.RemoveFail });
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

  removeManyComment: async (req, res) => {
    const listCommentId = req.body
    try {
      const result = await models.comments.updateMany(
        { "_id": { $in: listCommentId } },
        { $set: { deleted: true, deleteAt: Date.now() } },
        { new: true }
      );
      if (!result) {
        return res.status(400).send({ success: false, message: messages.RemoveFail });
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

  searchComment: async (req, res) => {

  }
};
