const middlewares = require("../../middlewares");
const Controller = require("../../controllers");

module.exports = app => {
  // Thêm bình luận
  app.post("/api/comment-management/add-comment",
  middlewares.auth.accessPermission("add-comment"),
  Controller.comment.addComment);

  // update bình luận
  app.put("/api/comment-management/update-comment",
  middlewares.auth.accessPermission("update-comment"),
  Controller.comment.updateComment);

  // remove one comment
  app.put("/api/comment-management/remove-one-comment",
    middlewares.auth.accessPermission("remove-one-comment"),
   Controller.comment.removeOneComment);

  // remove many comment
  app.put("/api/comment-management/remove-many-comment", 
    middlewares.auth.accessPermission("remove-many-comment"),
  Controller.comment.removeManyComment);

 // delete one comment
 app.delete("/api/comment-management/delete-one-comment", 
  middlewares.auth.accessPermission("delete-one-comment"),
  Controller.comment.deleteOneComment);

  // delete many comment
  app.delete("/api/comment-management/delete-many-comment", 
  middlewares.auth.accessPermission("delete-many-comment"),
 Controller.comment.deleteManyComment);


 
  // like and dislike
  app.put("/api/comment-management/like-and-unlike-comment",[
    middlewares.auth.accessPermission("like-and-unlike-comment"),
  ],Controller.comment.likeAndUnlike);

  // danh sách bình luận theo mã review or comment or chapter
  app.get("/api/comment-management/get-comment",[
  ],Controller.comment.getComment);
};
