const mongoose = require("mongoose");

const FanHistories = new mongoose.Schema({  
  authorId: [{ type: mongoose.Schema.Types.ObjectId, ref: "authors", required: true }],
  giftsId: [{ type: mongoose.Schema.Types.ObjectId, ref: "shopitems", required: true }],
  UserId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  deleted: { type: Boolean, default: false },
  time: { type: Date, default: Date.now},
  status: [{ type: mongoose.Schema.Types.ObjectId, ref:'status'}],
  createAt: { type: Date, default: Date.now },
  deleteAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now, commit: String },
});

module.exports = FanHistories;
