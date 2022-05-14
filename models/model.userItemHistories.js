const mongoose = require("mongoose");

const UserItemHistories = new mongoose.Schema({  
  itemId: [{ type: mongoose.Schema.Types.ObjectId, ref: "shopitems", required: true }],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  time: { type: Date, default: Date.now},
  status: [{ type: mongoose.Schema.Types.ObjectId, ref:'status'}],
  deleted: { type: Boolean, default: false },
  createAt: { type: Date, default: Date.now },
  deleteAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now, commit: String },
});

module.exports = UserItemHistories;
