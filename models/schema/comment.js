const mongoose = require("mongoose");

const Comments = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "users", default: null },
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: "books", default: null },
  PostId: { type: mongoose.Schema.Types.ObjectId, ref: "forumposts", default: null },
  reviewId: { type: mongoose.Schema.Types.ObjectId, ref: "reviews", default: null },
  commenter: { type: mongoose.Schema.Types.ObjectId, ref:'users', default: null},
  status: [{ type: mongoose.Schema.Types.ObjectId, ref:'status', default: null}],
  content: { type: String, trim: true, default: '',},
  deleted: { type: Boolean, default: false },
  createAt: { type: Date, default: Date.now },
  deleteAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now, commit: String },
});

module.exports = Comments;
