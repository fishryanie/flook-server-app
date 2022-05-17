const mongoose = require("mongoose");

const Vip = new mongoose.Schema({
  name: { type: String , unique: true, trim: true },
  deleted: { type: Boolean, default: false },
  createAt: { type: Date, default:Date.now, },
  deleteAt: { type: Date, default:Date.now, },
  updateAt: { type: Date, default:Date.now, commit:String, }
})

module.exports = Vip
 