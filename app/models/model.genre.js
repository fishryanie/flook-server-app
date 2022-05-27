const mongoose = require("mongoose");

const genreBook = new mongoose.Schema({
  name: { type: String , unique: true, trim: true },
  deleted: { type: Boolean, trim: true, default: false },
})

module.exports = genreBook
 