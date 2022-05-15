const mongoose = require("mongoose");

const genreBook = new mongoose.Schema({
  createAt: { type: Date, default: Date.now },
  deleteAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now, commit: String },
  name: { type: String , unique: true, trim: true, default: null },
  images: {
    wallPaper: {
      url: { type: String, default: ""},
      id: { type: String, default: "" },
    },
    background: {
      url: { type: String, default: "" },
      id: { type: String, default: "" },
    },
  },
})

module.exports = genreBook
 