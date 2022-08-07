const mongoose = require("mongoose");

const genreBook = new mongoose.Schema({
  createAt: { type: Date, default: Date.now },
  deleteAt: { type: Date, default: null},
  updateAt: { type: Date, default: null},
  deleted: { type: Boolean, default: false },
  image: { type: String, default: null ,trim: true},
  name: { type: String , unique: true, trim: true, default: null },
})

module.exports = genreBook
 