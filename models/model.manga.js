const mongoose = require("mongoose");
const messages = require("../constants/Messages");
const rating = /^(?:[1-9]|0[1-9]|10)$/;

const Book = new mongoose.Schema({
  title: { type: String, trim: true, required: true, unique: true },
  image: {
    wallPaper: {
      url: { type: String, default: "" },
      id: { type: String, default: "" },
    },
    bookCover: {
      url: { type: String, default: "" },
      id: { type: String, default: "" },
    },
  },
  author: [{ type: mongoose.Schema.Types.ObjectId, ref: "authors", required: true }],
  genre: [{ type: mongoose.Schema.Types.ObjectId, ref: "genres", required: true }],
  status: [{ type: String, trim: true, required: false, default: "Đang cập nhật" }],
  description: { type: String, trim: true, required: false },
  allowedAge: [{ type: Number, trim: true, required: false, default: 0 }],
  view: { type: Number, trim: true, required: false, default: 0 },
  deleted: { type: Boolean, default: false },
  createAt: { type: Date, default: "" },
  deleteAt: { type: Date, default: "" },
  updateAt: { type: Date, default: "", commit: String },
});

module.exports = Book;
