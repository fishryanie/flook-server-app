const middlewares = require("../middlewares");
const Controller = require("../controllers");

module.exports = app => {
  // Thêm bình luận
  app.post("/api/comment-management/addComment",[
    middlewares.auth.VerifyToken, 
    middlewares.auth.CheckAuth
  ],Controller.comment.addComment);

  // update bình luận
  app.put("/api/comment-management/updateComment/:id",[
    middlewares.auth.VerifyToken, 
    middlewares.auth.CheckAuth
  ],Controller.comment.updateComment);

  // delete comment
  app.delete("/api/comment-management/deleteComment/:id",[
    middlewares.auth.VerifyToken, 
    middlewares.auth.CheckAuth
  ],Controller.comment.deleteComment);
  // like and dislike
  app.put("/api/comment-management/likeAndDislikeComment/:id/:likeAndDislike",[
    middlewares.auth.VerifyToken, 
    middlewares.auth.CheckAuth
  ],Controller.comment.likeAndDislike);

  // danh sách bình luận theo mã phim sắp xếp theo ngày
  app.get("/api/comment-management/getAllCommentSort",[
    middlewares.auth.VerifyToken
  ],Controller.comment.getAllCommentSort);
};
