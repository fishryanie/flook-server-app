const mongoose = require("mongoose");

const Chapter = new mongoose.Schema({
  createAt: { type: Date, default: Date.now },
  deleteAt: { type: Date, default: null },
  updateAt: { type: Date, default: null },
  deleted: { type: Boolean, default: false },
  content: { type: String, default: null , trim: true },
  ebooks: { type: mongoose.Schema.Types.ObjectId, ref: 'ebooks', required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
  views: { type: Number, default: 0 },
  status: { type: String, default: null },
  name: { type: Number, unique: true,},
  images: [
    {
      number: { type: Number, default: 0 },
      url: { type: String, default: "" },
      id: { type: String, default: "" }
    }
  ],
});


module.exports = Chapter;