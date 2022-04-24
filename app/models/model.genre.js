const mongoose = require("mongoose");

const genreBook = new mongoose.Schema({
  name: { type: String , unique: true, trim: true }
})

module.exports = genreBook
 