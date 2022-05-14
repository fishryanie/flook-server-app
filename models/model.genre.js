const mongoose = require("mongoose");

const genreBook = new mongoose.Schema({
  name: { type: String , unique: true, trim: true },
  createAt: { type: Date, default: Date.now },
  deleteAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now, commit: String }
})

module.exports = genreBook
 