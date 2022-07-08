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
    const review = new models.reviews({ ...req.body, users: idUser });
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

    try {
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
        success: 200,
        message: messages.UpdateSuccessfully,
      };
      return res.status(200).send(response);
    } catch (error) {
      handleError.ServerError(error, res);
    }
  
};

//remove one review
const removeOneReview = async (req, res) => {
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
  // console.log("🚀 ~ file: review.js ~ line 73 ~ find ~ find", find)
  try {
    const review = { deleted:true, deleteAt:Date.now()};
    const result = await models.reviews.findOneAndUpdate(find,review, option);
    if(!result) {
      return res.status(400).send({ success: false,message: messages.RemoveNotSuccessfully});
    }


    const response = {
      data: result,
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
      const response = {
        data: result,
        status: 200,
        messages: messages.RemoveSuccessfully,
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
    if(!result) {
      return res.status(400).send({ success: false,message: messages.DeleteNotSuccessfully});}
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

//delete many review
const deleteManyReview = async (req, res) => {
 
    try {
      const listReviewId = req.body.listReviewId;
      const result = await models.reviews.deleteMany({ "_id":{ $in: listReviewId }});
      const response = {
        data: result,
        status: 200,
        messages: messages.DeleteSuccessfully,
      };
      return res.status(200).send(response);
    } catch (error) {
      handleError.ServerError(error, res);
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

 

  if (!comicId) {
    return res.status(400).send({ messages: messages.NotFound });
  } else {
    if (page && !sort && !rating) {
      console.log("get all phân trang");
      try {
        const result = await models.reviews.find({ ebooks: comicId, deleted: false })
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
        const result = await models.reviews.find({ ebooks: comicId, deleted: false })
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
        const result = await models.reviews.find({ ebooks: comicId, deleted: false })
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


module.exports = {
  addReview,
  updateReview,
  removeOneReview,
  removeManyReview,
  deleteOneReview,
  deleteManyReview,
  getAllReviewSort
 
};
