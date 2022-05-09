const mongoose = require("mongoose");

const Wallet = new mongoose.Schema({  
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  vipId: { type: mongoose.Schema.Types.ObjectId, ref: "vip" },
  vipTime: { type: Date, default: Date.now},
  coins: {type: Number, trim: true, default: 0},
  status: [{ type: mongoose.Schema.Types.ObjectId, ref:'status'}],
  deleted: { type: Boolean, default: false },
  createAt: { type: Date, default: Date.now },
  deleteAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now, commit: String },
});

module.exports = Wallet;
