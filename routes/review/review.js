const middlewares = require("../../middlewares");
const Controller = require("../../controllers");

module.exports = app => {
  // Thêm review
  app.post("/api/review-management/addReview", 
  middlewares.auth.accessPermission("addReview"),
  Controller.review.addReview);

  // update review
  app.put("/api/review-management/updateReview/:id",[
    middlewares.auth.accessPermission("updateReview"),
  ],Controller.review.updateReview);

  // delete comment
  app.put("/api/review-management/deleteReview/:id",[
    middlewares.auth.accessPermission("deleteReview"),
  ],Controller.review.deleteReview);
  // // like and dislike
  // app.put("/api/comment-management/likeAndDislikeComment/:id/:likeAndDislike",[

  // ],Controller.comment.likeAndDislike);

  // danh sách review theo comic sắp xếp theo ngày
  app.get("/api/review-management/getAllReviewSort",[

  ],Controller.review.getAllReviewSort);
};
