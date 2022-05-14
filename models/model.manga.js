const mongoose = require("mongoose");
const messages = require("../constants/Messages");
const rating = /^(?:[1-9]|0[1-9]|10)$/;

const EBooks = new mongoose.Schema({
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
  categoryID: [{ type: mongoose.Schema.Types.ObjectId, ref: "category", required: true }],
  author: [{ type: mongoose.Schema.Types.ObjectId, ref: "authors", required: true }],
  genre: [{ type: mongoose.Schema.Types.ObjectId, ref: "genres", required: true }],
  vip: {type: Boolean, default: false},
  description: { type: String, trim: true, required: false },
  bookStatus: [{ type: String, trim: true, required: false, default: "Đang cập nhật" }],
  numChapters:{type: Number, default: 0},
  launchDate: {type: Date, default: ""},
  allowedAge: [{ type: Number, trim: true, required: false, default: 0 }],
  view: { type: Number, trim: true, required: false, default: 0 },
  status: [{ type: mongoose.Schema.Types.ObjectId, ref:'status'}],
  deleted: { type: Boolean, default: false },
  createAt: { type: Date, default: "" },
  deleteAt: { type: Date, default: "" },
  updateAt: { type: Date, default: "", commit: String },
});

module.exports = EBooks;
