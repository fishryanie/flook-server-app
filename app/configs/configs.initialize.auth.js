const { MODEL_ROLES, MODEL_USERS } = require('../models')
const AVATAR_MODERATOR = 'https://res.cloudinary.com/dwnucvodc/image/upload/v1640511106/Flex-ticket/ImageUser/avataModerator_gg9a6q.jpg'
const AVATAR_ADMIN = 'https://res.cloudinary.com/dwnucvodc/image/upload/v1640511892/Flex-ticket/ImageUser/avatarAdmin_rqrvh1.jpg'
const AVATAT_USER = 'https://res.cloudinary.com/dwnucvodc/image/upload/v1640511902/Flex-ticket/ImageUser/avatarUser_rhrrrk.jpg'

const array_initial_roles = ['moderator', 'admin', 'user']

const array_initialize_auth = [
  { 
    displayName:'Moderator', 
    userName:'moderator123456', 
    password:'Moderator123456@',
    email:'moderator123@gmail.com', 
    phoneNumber:'0979955925', 
    avatar:AVATAR_MODERATOR, 
    gender: true, isActive: true
  },
  { 
    displayName:'Admin', 
    userName:'admin123456', 
    password:'Admin123456@', 
    email: 'admin123@gmail.com', 
    phoneNumber: '1234567890', 
    avatar: AVATAR_ADMIN, 
    gender: false, isActive: true 
  },
  { 
    displayName: 'User',
    userName: 'user123456',
    password: 'User123456@',
    email: 'user123@gmail.com',
    phoneNumber: '0123456789',
    avatar: AVATAT_USER,
    gender: true, isActive: true
  }
]

const initialize_create_roles = () =>{
  MODEL_ROLES.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) { 
      for (let index = 0; index < array_initial_roles.length; index++) {
        return new MODEL_ROLES({name: array_initial_roles[index]})
        .save(err => {
          err && console.log("error", err);
          console.log(`added ${array_initial_roles[index]} to roles collection`);
        });
      }
    }
  });
}

const initialize_create_auth = () => {
  for (let index = 0; index < array_initialize_auth.length; index++) {
    MODEL_USERS.findOne({ userName: array_initialize_auth[index].userName }, (err, user)=>{
      if(err) return console.log(err)
      if(!user){
        MODEL_ROLES.find({name: { $in: array_initial_roles[index] }}, (err, roles) => {
          if(err) return console.log(err)  
          const User = new MODEL_USERS(array_initialize_auth[index])
          User.roles = roles.map(role => role._id);
          User.save()
          .then(data => console.log(data))
          .catch(err => console.log(err))
        });
      }
    })
  }
}


const initialize = {
  initialize_create_auth,
  initialize_create_roles,
}

module.exports = initialize
