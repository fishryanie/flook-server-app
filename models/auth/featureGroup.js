const mongoose = require("mongoose");

const FeatureGroups = new mongoose.Schema({
  featureGroupName: {type:String, required:true, trim: true},
  deleted: { type: Boolean, default: false},
  createAt: { type: Date, default:Date.now,},
  deleteAt: { type: Date, default:Date.now,},
  updateAt: { type: Date, default:Date.now,}
})

module.exports = FeatureGroups
 
