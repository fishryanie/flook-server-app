const mongoose = require("mongoose");

const Casts = new mongoose.Schema({
  castName: { type: String, trim: true, required: true, unique: true },
  movieId: [{ type: mongoose.Schema.Types.ObjectId, ref: "movies" }],
  status: { type: Number, default: 1 },
  castAvatar: { type: String, trim: true, default:'' },
  createAt: { type: Date, default: Date.now },
  deleteAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now },
});

module.exports = Casts

