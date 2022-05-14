const mongoose = require("mongoose");

const ShopItems = new mongoose.Schema({
  name: { type: String, trim: true, required: true, unique: true },
  image: {
    url: { type: String, default: "" },
    id: { type: String, default: "" }
  },
  price: {type: Number, trim: true},
  content:{type: String, default: null},
  status: [{ type: mongoose.Schema.Types.ObjectId, ref:'status'}],
  deleted: { type: Boolean, default: false },
  createAt: { type: Date, default: Date.now },
  deleteAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now, commit: String },
});

module.exports = ShopItems;
