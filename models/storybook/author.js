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
      url: { type: String, default: "https://res.cloudinary.com/dwnucvodc/image/upload/v1661606345/Flex-ticket/ImageUser/icon_qtihnv.png" },
      id: { type: String, default: "Flex-ticket/ImageUser/icon_qtihnv.png" },
    },
    wallPaper: {
      url: { type: String, default: "https://res.cloudinary.com/dwnucvodc/image/upload/v1661606345/Flex-ticket/ImageUser/icon_qtihnv.png" },
      id: { type: String, default: "Flex-ticket/ImageUser/icon_qtihnv.png" },
    },
  }
});

module.exports = Author;