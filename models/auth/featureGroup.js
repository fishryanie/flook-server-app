const mongoose = require("mongoose");

const FeatureGroups = new mongoose.Schema({
  name: {type:String, required:true, trim: true, unique: true},
  deleted: { type: Boolean, default: false},
  createAt: { type: Date, default:Date.now,},
  deleteAt: { type: Date, default:null,},
  updateAt: { type: Date, default:null,}
})

module.exports = FeatureGroups
 
