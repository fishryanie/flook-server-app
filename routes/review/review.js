const middlewares = require("../../middlewares");
const Controller = require("../../controllers");

module.exports = app => {
  // Thêm review
  app.post("/api/review-management/add-review",
    middlewares.auth.accessPermission("add-review"),
    Controller.review.addReview);

  // update review
  app.put("/api/review-management/update-review", [
    middlewares.auth.accessPermission("update-review"),
  ], Controller.review.updateReview);

  // remove one review
  app.put("/api/review-management/remove-one-review", [
    middlewares.auth.accessPermission("remove-one-review"),
  ], Controller.review.removeOneReview);

  // remove many review
  app.put("/api/review-management/remove-many-review", [
    middlewares.auth.accessPermission("remove-many-review"),
  ], Controller.review.removeManyReview);

  // delete one review
  app.delete("/api/review-management/delete-one-review", [
    middlewares.auth.accessPermission("delete-one-review"),
  ], Controller.review.deleteOneReview);

  // delete many review
  app.delete("/api/review-management/delete-many-review", [
    middlewares.auth.accessPermission("delete-many-review"),
  ], Controller.review.deleteManyReview);


  app.get("/api/review-management/getAllReviewSort", [

  ], Controller.review.getAllReviewSort);
};
