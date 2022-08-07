const mongoose = require("mongoose");

const Author = new mongoose.Schema({
  createAt: { type: Date, default: Date.now },
  deleteAt: { type: Date, default: null },
  updateAt: { type: Date, default: null },
  deleted: { type: Boolean, default: false },
  name: { type: String, trim: true, default: null, unique: true },
  license: { type: mongoose.Schema.Types.ObjectId, ref: "users", default: null},
  images: {
    avatar: {
      url: { type: String, default: "https://res.cloudinary.com/dwnucvodc/image/upload/v1655780951/Flex-ticket/ImageUser/avatar-default_kzmdk1.png"},
      id: { type: String, default: "Flex-ticket/ImageBook/wallpaper-default_pbgxfu" },
    },
    wallPaper: {
      url: { type: String, default: "https://res.cloudinary.com/dwnucvodc/image/upload/v1655801754/Flex-ticket/ImageUser/wallpaper-default_pbgxfu.png" },
      id: { type: String, default: "Flex-ticket/ImageBook/wallpaper-default_pbgxfu" },
    },
  }
});

module.exports = Author;