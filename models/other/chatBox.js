const mongoose = require("mongoose");

const ChatBox = new mongoose.Schema({
  senderId: [{ type: mongoose.Schema.Types.ObjectId, ref: "user", required: true }],
  receiverId: [{ type: mongoose.Schema.Types.ObjectId, ref: "user", required: true }],
  image: {
    url: { type: String, default: "" },
    id: { type: String, default: "" }
  },
  content: {type: String, default: "" },
  time: { type: Date, default: Date.now},
  status: [{ type: mongoose.Schema.Types.ObjectId, ref:'status'}],
  createAt: { type: Date, default: Date.now },
  deleteAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now, commit: String },
});

module.exports = ChatBox;