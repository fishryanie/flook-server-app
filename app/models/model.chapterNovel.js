const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);

const ChapterNovel = new mongoose.Schema({
  name: { type: Number, unique: false },
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'ebooks', required: true },
  content: {type: String, default: "" },
  numLikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "users", index: true }],
  numViews: { type: Number, default: 0},
  status: [{ type: mongoose.Schema.Types.ObjectId, ref:'status'}],
  deleted: { type: Boolean, default: false },
  createAt: { type: Date, default: Date.now },
  deleteAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now, commit: String },
});

ChapterNovel.plugin(AutoIncrement, { inc_field: 'name' });

module.exports = ChapterNovel;