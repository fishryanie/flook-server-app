const mongoose = require("mongoose");

const Comments = new mongoose.Schema({
  idUser: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  idBook: { type: mongoose.Schema.Types.ObjectId, ref: "books" },
  rating: { type: Number, trim: true },
  content: { type: String, trim: true },
  status: { type: Number, trim: true, default: 1 },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "users", index: true }],
  disLikes: [
    {type: mongoose.Schema.Types.ObjectId, ref: "users", index: true },
  ],
  createAt: { type: Date, default: Date.now },
  deleteAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now, commit: String },
});

module.exports = Comments;
