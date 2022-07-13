const mongoose = require("mongoose");

const Comments = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "users", default: null },
  postId: { type: mongoose.Schema.Types.ObjectId, ref: "forumposts", default: null },
  reviewId: { type: mongoose.Schema.Types.ObjectId, ref: "reviews", default: null },
  commentId: { type: mongoose.Schema.Types.ObjectId, ref:'comments', default: null},
  chapterId: { type: mongoose.Schema.Types.ObjectId, ref:'chapters', default: null},
  likes:[{ type: mongoose.Schema.Types.ObjectId, ref: "users", default: null }],
  status: { type: String, default: null },
  content: { type: String, trim: true, default: '',},
  deleted: { type: Boolean, default: false },
  createAt: { type: Date, default: Date.now },
  deleteAt: { type: Date, default:null },
  updateAt: { type: Date, default: null },
});

module.exports = Comments;
