const mongoose = require("mongoose");

const Roles = new mongoose.Schema({
  name: { type: String , unique: true, trim: true, require: true },
  description: { type: String , require: true, trim: true},
  deleted: { type: Boolean, default: false },
  createAt: { type: Date, default: Date.now, },
  deleteAt: { type: Date, default: null, },
  updateAt: { type: Date, default: null, }
})

module.exports = Roles
