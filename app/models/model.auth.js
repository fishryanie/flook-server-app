const bcrypt = require('bcrypt');
const messages = require('../constants/Messages')
const avataMale = 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'
const avataFemale = 'https://cdn-icons-png.flaticon.com/512/2922/2922565.png'
const password_pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,30}$/
const noSpace_special = /^[a-zA-Z0-9]*$/
const phone_pattern = /^\d{10}$/
const mongoose = require("mongoose");


const Users = new mongoose.Schema({
  userName: { type:String, trim:true, required:true, unique:true, minlength: 8, maxlength: 16, match: [noSpace_special, messages.validateUserName]},
  password: { type:String, trim:true, required:true, match:[password_pattern, messages.validatePassword]},
  email: { type: String, trim:true, required: true, unique: true },
  gender: { type: Boolean, trim: true, default: true },
  status: { type: Number, default: 1 },
  roles: [{ type: mongoose.Schema.Types.ObjectId, ref: "roles", required: true }],
  avatar: { type: String, trim: true, default: this.gender === true ? avataMale : avataFemale },
  avatarId: { type: String, default: ""},
  isActive: { type: Boolean, trim: true, default: false },
  displayName: { type: String, trim: true, default: null },
  phoneNumber: { type: String, trim: true, default: null, unique: true, match:[phone_pattern, messages.validatePhone]},
  bookingHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'bookingHistory'}],
  listMovieFavorite: [{ type: mongoose.Schema.Types.ObjectId, ref:'movies'}],
  deleted: { type: Boolean, default: false },
  
  createAt: { type: Date, default:Date.now, },
  deleteAt: { type: Date, default:Date.now, },
  updateAt: { type: Date, default:Date.now, commit:String, }
})



Users.pre('save', function(next){
  if (this.isModified('password')) {
    const salt = bcrypt.genSaltSync(10)
    this.password = bcrypt.hashSync(this.password, salt)
    return next()
  }
})


Users.static('verifyPassword', (password, hash) => {
  console.log(password)
  if (password && hash) {
    let passwordIsValid = bcrypt.compareSync(password, hash)
    if (!passwordIsValid) {
      const response = { 
        accessToken: null,  
        messageError: messages.InvalidPassword
      }
      return response
    }
  }
})


Users.static('hashPassword', (password) => {
  if (password) {
    const salt = bcrypt.genSaltSync(10)
    return bcrypt.hashSync(password, salt)
  }
})


module.exports = Users
