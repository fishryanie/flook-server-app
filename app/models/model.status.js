const mongoose = require("mongoose");

const status = new mongoose.Schema({
  status: { type: String, default: null },
  
  createAt: { type: Date, default:Date.now, },
  deleteAt: { type: Date, default:Date.now, },
  updateAt: { type: Date, default:Date.now, commit:String, }
})


module.exports = status
 