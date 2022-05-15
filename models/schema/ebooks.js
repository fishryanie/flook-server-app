const mongoose = require("mongoose");
const messages = require("../../constants/Messages");
const rating = /^(?:[1-9]|0[1-9]|10)$/;

const Ebooks = new mongoose.Schema({
  createAt: { type: Date, default: Date.now },
  deleteAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now },
  launchDate: {type: Date, default: Date.now},
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "categories" },
  authorId: [{ type: mongoose.Schema.Types.ObjectId, ref: "authors", }],
  genreId: [{ type: mongoose.Schema.Types.ObjectId, ref: "genres",}],
  statusId: [{ type: mongoose.Schema.Types.ObjectId, ref:'status'}],
  deleted: { type: Boolean, default: false },
  description: { type: String, trim: true, required: false },
  numChapters:{type: Number, default: 0},
  allowedAge: [{ type: Number, trim: true, required: false, default: 0 }],
  title: { type: String, trim: true, required: true, unique: true },
  view: { type: Number, trim: true, required: false, default: 0 },
  vip: {type: Boolean, default: false},
  images: {
    wallPaper: {
      url: { type: String, trim: true, default: "",},
      id: { type: String, trim: true, default: "" },
    },
    background: {
      url: { type: String, trim: true, default: "" },
      id: { type: String, trim: true, default: "" },
    },
  },
});





module.exports = Ebooks;
