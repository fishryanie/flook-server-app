const mongoose = require("mongoose");

const Roles = new mongoose.Schema({
  name: { type: String , unique: true, trim: true }
})

module.exports = Roles
 