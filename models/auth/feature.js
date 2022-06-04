const mongoose = require("mongoose");

const Features = new mongoose.Schema({
  featureName: {type:String, trim: true},
  featureGroupId: {type: mongoose.Schema.Types.ObjectId, ref:'featureGroups'},
  roles: [{type: mongoose.Schema.Types.ObjectId, ref:'roles'}],
  deleted: { type: Boolean, default: false},
  createAt: { type: Date, default:Date.now,},
  deleteAt: { type: Date, default:Date.now,},
  updateAt: { type: Date, default:Date.now,}
})

module.exports = Features

