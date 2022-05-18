const mongoose = require("mongoose");

const Author = new mongoose.Schema({
  createAt: { type: Date, default: Date.now },
  deleteAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now },
  name: { type: String, trim: true, default: null, unique: true },
  license: { type: Boolean, trim: true, default: false },
  images: {
    wallPaper: {
      url: { type: String, trim: true, default: ""},
      id: { type: String, trim: true, default: "" },
    },
    background: {
      url: { type: String, trim: true, default: "" },
      id: { type: String, trim: true, default: "" },
    },
  },
  
});

module.exports = Author;