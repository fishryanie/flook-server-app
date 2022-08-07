const bcrypt = require('bcrypt');
const messages = require('../../constants/messages')
const password_pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,30}$/
const mongoose = require("mongoose");


const Users = new mongoose.Schema({
  createAt: { type: Date, default: Date.now, },
  deleteAt: { type: Date, default: null, },
  updateAt: { type: Date, default: null, },
  isActive: { type: Boolean, default: false },
  deleted: { type: Boolean, default: false },  
  status: { type: String, default: null },
  roles: [{ type: mongoose.Schema.Types.ObjectId, ref: "roles", default: [] }],
  email: { type: String, trim:true, required: true, unique: true },
  username: { type:String, trim:true, required:true, unique:true, minlength: 8, maxlength: 30},
  password: { type:String, trim:true, required:true, match:[password_pattern, messages.validatePassword]},
  phoneNumber: { type: String, trim: true, default: null },
  displayName: { type: String, trim: true, default: null },
  gender: { type: Boolean, trim: true, default: true },
  vip: { type: Boolean, trim: true, default: false },
  coin:{ type: Number, trim: true, default: 0 },
  deviceToken:{ type: String, trim: true, default: null },
  history: {
    read: { 
      ebooks: [{type: mongoose.Schema.Types.ObjectId, ref:'ebooks', default: []}],
      chapters: [{type: mongoose.Schema.Types.ObjectId, ref:'chapters', default: []}],
    },
    download: { 
      ebooks: [{type: mongoose.Schema.Types.ObjectId, ref:'ebooks', default: []}],
      chapters: [{type: mongoose.Schema.Types.ObjectId, ref:'chapters', default: []}]
    },
  },
  subscribe: {
    ebooks: [{type: mongoose.Schema.Types.ObjectId, ref:'ebooks', default: []}],
    author: [{type: mongoose.Schema.Types.ObjectId, ref:'authors', default: []}],
    users: [{type: mongoose.Schema.Types.ObjectId, ref:'users', default: []}],
  },
  images: {
    avatar: {
      url: { type: String, default: "https://res.cloudinary.com/dwnucvodc/image/upload/v1655780951/Flex-ticket/ImageUser/avatar-default_kzmdk1.png"},
      id: { type: String, default: "Flex-ticket/ImageBook/wallpaper-default_pbgxfu" },
    },
    wallPaper: {
      url: { type: String, default: "https://res.cloudinary.com/dwnucvodc/image/upload/v1655801754/Flex-ticket/ImageUser/wallpaper-default_pbgxfu.png" },
      id: { type: String, default: "Flex-ticket/ImageBook/wallpaper-default_pbgxfu" },
    },
  },
})



Users.pre('save', function(next){
  if (this.isModified('password')) {
    const salt = bcrypt.genSaltSync(10)
    this.password = bcrypt.hashSync(this.password, salt)
    return next()
  }
})


Users.static('verifyPassword', (password, hash) => {
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
