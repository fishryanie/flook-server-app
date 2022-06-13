const middlewares = require("../../middlewares");
const Controller = require("../../controllers");

module.exports = app => {
  // Thêm bình luận
  app.post("/api/comment-management/addComment",[
  ],Controller.comment.addComment);

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
