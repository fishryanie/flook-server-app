const mongoose = require("mongoose");

const ForumPost = new mongoose.Schema({  
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  itemId: [{ type: mongoose.Schema.Types.ObjectId, ref: "topics", required: true }],
  title: { type: String, trim: true, required: true, unique: true },
  content: {type: String, default: "" },
  image: [
    {
      url: { type: String, default: "" },
      id: { type: String, default: "" }
    }
  ],
  status: [{ type: mongoose.Schema.Types.ObjectId, ref:'status'}],
  deleted: { type: Boolean, default: false },
  createAt: { type: Date, default: Date.now },
  deleteAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now, commit: String },
});

module.exports = ForumPost;
