const mongoose = require("mongoose");

const Comments = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: "books" },
  PostId: { type: mongoose.Schema.Types.ObjectId, ref: "forumposts" },
  content: { type: String, trim: true },
  commenter: [{ type: mongoose.Schema.Types.ObjectId, ref:'users'}],
  status: [{ type: mongoose.Schema.Types.ObjectId, ref:'status'}],
  deleted: { type: Boolean, default: false },
  createAt: { type: Date, default: Date.now },
  deleteAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now, commit: String },
});

module.exports = Comments;
