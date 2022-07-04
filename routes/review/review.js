const middlewares = require("../../middlewares");
const Controller = require("../../controllers");

module.exports = app => {
  // Thêm review
  app.post("/api/review-management/addReview", 
  middlewares.auth.accessPermission("addReview"),
  Controller.review.addReview);

  // update review
  app.put("/api/review-management/update-review",[
    middlewares.auth.accessPermission("update-review"),
  ],Controller.review.updateReview);

  // remove one comment
  app.put("/api/review-management/remove-one-review",[
    middlewares.auth.accessPermission("remove-one-review"),
  ],Controller.review.removeOneReview);

    // remove all comment
    app.put("/api/review-management/remove-many-review",[
      middlewares.auth.accessPermission("remove-many-review"),
    ],Controller.review.removeManyReview);


  
  app.get("/api/review-management/getAllReviewSort",[

  ],Controller.review.getAllReviewSort);
};
