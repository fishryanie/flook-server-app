const mongoose = require("mongoose");

const Ebooks = new mongoose.Schema({
  createAt: { type: Date, default: Date.now },
  deleteAt: { type: Date, default: null },
  updateAt: { type: Date, default: null },
  launchDate: {type: Date, default: null},
  authors: [{ type: mongoose.Schema.Types.ObjectId, ref: "authors", }],
  genres: [{ type: mongoose.Schema.Types.ObjectId, ref: "genres",}],
  status: { type: String, default: null, trim: true },
  deleted: { type: Boolean, default: false },
  description: { type: String, trim: true, default: null},
  numChapters: { type: Number, default: 0 },
  allowedAge: { type: Number, trim: true, default: 0 },
  title: { type: String, trim: true, required: true, unique: true },
  view: { type: Number, trim: true, default: 0 },
  vip: {type: Boolean, default: false},
  images: {
    wallPaper: {
      url: { type: String, trim: true, required: true,},
      id: { type: String, trim: true, required: true, },
    },
    background: {
      url: { type: String, trim: true, required: true, },
      id: { type: String, trim: true, required: true, },
    },
  },
});





module.exports = Ebooks;
