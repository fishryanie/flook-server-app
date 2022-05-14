const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);

const Chapter = new mongoose.Schema({
  name: { type: Number, unique: false },
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'mangas', required: true },
  image: [
    {
      number: { type: Number },
      url: { type: String, default: "" },
      id: { type: String, default: "" }
    }

  ],
  createAt: { type: Date, default: Date.now },
  deleteAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now, commit: String },
});

Chapter.plugin(AutoIncrement, { inc_field: 'name' });

module.exports = Chapter;