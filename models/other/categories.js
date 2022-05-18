const mongoose = require("mongoose");

const categoriesBook = new mongoose.Schema({
  name: { type: String , unique: true, trim: true , required: true},
  deleted: { type: Boolean, default: false },
  createAt: { type: Date, default:Date.now, },
  deleteAt: { type: Date, default:Date.now, },
  updateAt: { type: Date, default:Date.now, commit:String, }
})


module.exports = categoriesBook
 