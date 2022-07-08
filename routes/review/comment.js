const upload = require("../../functions/UploadImage");
const middlewares = require("../../middlewares");
const Controller = require('../../controllers');
const routesString = require('../../constants/routes');
const subStr = require('../../functions/subString')

module.exports = app => {
  // Thêm bình luận
  app.post("/api/comment-management/addComment", [
  ], Controller.comment.addComment);

  // update bình luận
  app.put(routesString.updateOneComment, 
    middlewares.auth.accessPermission(subStr(routesString.updateOneComment)), 
    Controller.comment.updateComment);

  // delete comment
  app.delete(routesString.deleteOneComment, 
    middlewares.auth.accessPermission(subStr(routesString.deleteOneComment)), 
    Controller.comment.deleteComment);
    
  // like and dislike
  app.put("/api/comment-management/likeAndDislikeComment/:id/:likeAndDislike", [

  ], Controller.comment.likeAndDislike);

  // danh sách bình luận theo mã phim sắp xếp theo ngày
  app.get("/api/comment-management/getAllCommentSort", [

  ], Controller.comment.getAllCommentSort);
};



