const mongoose = require("mongoose");

const Evaluation = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: "ebooks" },
  rating: { type: Number, trim: true },
  content: { type: String, trim: true },
  
  status: [{ type: mongoose.Schema.Types.ObjectId, ref:'status'}],
  deleted: { type: Boolean, default: false },
  createAt: { type: Date, default: Date.now },
  deleteAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now, commit: String },
});

module.exports = Evaluation;
