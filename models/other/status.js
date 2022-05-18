const mongoose = require("mongoose");

const status = new mongoose.Schema({
  name: { type: String, default: '' },
  createAt: { type: Date, default:Date.now, },
  deleteAt: { type: Date, default:Date.now, },
  updateAt: { type: Date, default:Date.now, }
})


module.exports = status
 