const mongoose = require("mongoose");

const Movies = new mongoose.Schema({
  name: { type: String, default: "" },
  genre: { type: String, default: "" },
  trailer: { type: String, default: "" },
  premiere: { type: Date, default: Date.now },
  durations: { type: String, default: "" },
  discription: { type: String, default: "" },
  comment: [{ type: mongoose.Schema.Types.ObjectId, ref: "comments" }],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
  images: {
    image: { type: String, default: "" },
    background: { type: String, default: "" },
    otherImages: [],
  },
  createAt: { type: Date, default: Date.now },
  deleteAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now, commit: String },
});


module.exports = Movies