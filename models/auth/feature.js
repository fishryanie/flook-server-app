const mongoose = require("mongoose");

const Features = new mongoose.Schema({
  featureName: {type:String, trim: true},
  featureGroup: {type: mongoose.Schema.Types.ObjectId, ref:'featureGroups', default: null},
  roles: [{type: mongoose.Schema.Types.ObjectId, ref:'roles', default: null}],
  deleted: { type: Boolean, default: false},
  createAt: { type: Date, default:Date.now,},
  deleteAt: { type: Date, default: null,},
  updateAt: { type: Date, default: null,}
})

module.exports = Features

