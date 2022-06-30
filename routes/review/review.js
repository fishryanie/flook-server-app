const middlewares = require("../../middlewares");
const Controller = require("../../controllers");

module.exports = app => {
  // Thêm review
  app.post("/api/review-management/addReview", 
  middlewares.auth.accessPermission("addReview"),
  Controller.review.addReview);

  // update bình luận
  app.put("/api/comment-management/updateComment/:id",[
  ],Controller.comment.updateComment);

  // delete comment
  app.delete("/api/comment-management/deleteComment/:id",[

  ],Controller.comment.deleteComment);
  // like and dislike
  app.put("/api/comment-management/likeAndDislikeComment/:id/:likeAndDislike",[

  ],Controller.comment.likeAndDislike);

  // danh sách bình luận theo mã phim sắp xếp theo ngày
  app.get("/api/comment-management/getAllCommentSort",[

  ],Controller.comment.getAllCommentSort);
};
