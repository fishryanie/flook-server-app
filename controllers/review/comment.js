const models = require("../../models");
const messages = require("../../constants/messages");
const handleError = require("../../error/HandleError");
const { addDays } = require("../../functions/globalFunc");


module.exports = {
  

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
    const user = req.userIsLogged;
    let Comment;
    if (req.body.content.trim().length === 0) {
      res.status(400).send({ message: 'Nội dung không được để trống' });
    } else {
      for (const role of user.roles) {
        if (role.name === "Moderator" || role.name === "Admin") {
          Comment = new models.comments({ ...req.body })
          break;
        } else {
          Comment = new models.comments({ ...req.body, userId: user._id.toString() });
          break;
        }
      }
      Comment.save()
        .then((data) =>
          res.status(200).send({
            data: data,
            status: 200,
            message: messages.CreateSuccessfully,
          })
        )
        .catch((error) => {
          console.log(`error ${error}`);
          handleError.ServerError(error, res);
        });
    }
  },

  insertManyComment: async (req, res) => {
 
  },

  updateOneComment: async (req, res) => {
    const user = req.userIsLogged;
    const commentUserIdBody = req.body.userId;
    const like = req.params.likeordislike;
    const commentId = req.query.id;
    const option = { new: true };
    let find

    try {
      if (req.body.content.trim().length === 0) {
        res.status(400).send({ message: 'Nội dung không được để trống' });
      } else {
        for (const role of user.roles) {
          if (role.name === "Moderator" || role.name === "Admin") {
            find = { _id: commentId }
            break;
          } else if (user._id.toString() === commentUserIdBody){
            find = { _id: commentId, userId: user._id.toString()}
            break;
          }else {
            return res.status(404).send({ message: "Không thể sửa comment của người khác" });
          }
        }
      }
      const comment = { ...req.body, updateAt: addDays(0) };
      const result = await models.comments.findByIdAndUpdate(
        find,
        comment,
        option
      );
      const response = {
        data: result,
        status: 200,
        message: messages.UpdateSuccessfully,
      };
      return res.status(200).send(response);
    } catch (error) {
      handleError.ServerError(error, res);
    }
  
    // if (user._id.toString() === commentUserIdBody) {
    //   try {
    //     const Comment = new models.comments({ ...req.body, _id: commentId });
    //     const result = await models.comments.findByIdAndUpdate(
    //       commentId,
    //       Comment,
    //       option
    //     );
    //     const response = {
    //       data: result,
    //       status: 200,
    //       message: messages.UpdateSuccessfully,
    //     };
    //     return res.status(200).send(response);
    //   } catch (error) {
    //     handleError.ServerError(error, res);
    //   }
    // } else {
    //   return res.status(404).send({ message: "Không thể sửa comment của người khác" });
    // }
  },

  deleteOneComment: async (req, res) => {
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
  },

  deleteManyComment: async (req, res) => {

  },

  removeOneComment: async (req, res) => {
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
          find = { _id: commentId, users: user._id.toString() }
          break;
        }
      }
      const comment = { deleted: true, deleteAt: addDays(0) };
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
        { $set: { deleted: true, deleteAt: addDays(0) } },
        { new: true }
      );
      if (!result) {
        return res.status(400).send({ success: false, message: messages.DeleteFail });
      }
      const response = {
        success: true,
        message: messages.DeleteSuccessfully,
      };
      return res.status(200).send(response);
    } catch (error) {
      handleError.ServerError(error, res);
    }
  },

  searchComment: async (req, res) =>{
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
  },
  
  likeAndDislike: async (req, res) => {
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
  }
};
