const mongoose = require("mongoose");

const Author = new mongoose.Schema({
  license:{ type: Boolean, trim: true, default: false},
  name: { type: String, trim: true, required: true, unique: true },
  image: {
    url: { type: String, default: "" },
    id: { type: String, default: "" }
  },
  createAt: { type: Date, default: Date.now },
  deleteAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now, commit: String },
});

module.exports = Author;