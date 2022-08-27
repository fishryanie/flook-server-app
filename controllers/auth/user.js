const models = require("../../models");
const cloudinary = require('../../configs/cloudnary')
const jwt = require("jsonwebtoken");
const SendMail = require("../../functions/SendMail");

const configsToken = require("../../configs/token");
const messages = require("../../constants/messages");
const handleError = require('../../error/HandleError');
const { generatePassword, addDays } = require("../../functions/globalFunc");
const folder = { folder: 'Flex-ticket/ImageUser' }


// const RefreshTokenController = async (req, res) => {
//   const { refreshToken: requestToken } = req.body;

//   if (requestToken == null) {
//     return res.status(403).json({ message: "Refresh Token is required!" });
//   }

//   try {
//     let refreshToken = await RefreshToken.findOne({ token: requestToken });

//     if (!refreshToken) {
//       res.status(403).json({ message: "Refresh token is not in database!" });
//       return;
//     }

//     if (RefreshToken.verifyExpiration(refreshToken)) {
//       RefreshToken.findByIdAndRemove(refreshToken._id, {
//         useFindAndModify: false,
//       }).exec();

//       res.status(403).json({
//         message: "Refresh token was expired. Please make a new signin request",
//       });
//       return;
//     }

//     let newAccessToken = jwt.sign(
//       { id: refreshToken.user._id },
//       config.secret,
//       {
//         expiresIn: config.jwtExpiration,
//       }
//     );

//     return res.status(200).json({
//       accessToken: newAccessToken,
//       refreshToken: refreshToken.token,
//     });
//   } catch (err) {
//     return res.status(500).send({ message: err });
//   }
// };





const DeleteUserController = async (req, res) => {
  try {
    const id = req.params.id;
    const row = await models.users.findByIdAndRemove(id).exec();
    if (!row) {
      console.log(messages.NotFound);
      return res.status(404).send({ messages: messages.NotFound + id });
    }
    console.log(messages.DeleteSuccessfully);
    return res.status(200).send({ messages: messages.DeleteSuccessfully });
  } catch (error) {
    return handleError.ServerError(error, res)
  }
};

module.exports = {
  Login: async (req, res) => {
    const result = req.userIsLogged;
    const token = jwt.sign(
      { id: result._id },
      configsToken.secret,
      { expiresIn: configsToken.jwtExpiration }
    );
    const authorities = [];
    for (let i = 0; i < result.roles.length; i++) {
      authorities.push("ROLE_" + result.roles[i].name.toUpperCase());
    }
    const data = {
      displayName: result.displayName,
      images: result.images,
      roles: authorities[0],
      accessToken: token,
    };
    if (!result.isActive) {
      return res.status(400).send({ success: false, message: messages.LoginFailed });
    }
    return res.status(200).send({ data, success: true, message: messages.LoginSuccessfully });
  },

  Register: async (req, res) => {
    const newPassword = generatePassword()
    const email = req.body.email
    try {
      const USER = new models.users({
        email: email,
        displayName: email.slice(0,email.indexOf('@')),
        username: email,
        password: newPassword
      })
      const rolesName = await models.roles.find({ name: 'User' });
      USER.roles = rolesName?.map((role) => role._id);
      const register = await USER.save();
      const sendMail = await SendMail(req, res, email, 'Register', newPassword, register._id);

      sendMail && register && res.status(200).send({ data: register, success: true, messages: 'sign up successfully, check your mail to get password' });

    } catch (error) {
      return handleError.ServerError(error, res)
    }
  },

  forgotPassword: async (req, res) => {
    try {
      const { userId, email } = req.USER
      const newPassword = generatePassword();
      const result = await models.users.findOneAndUpdate(
        { email: email },
        { password: await models.users.hashPassword(newPassword) },
        { new: true }
      );
      if (!result) {
        return res.status(400).send({ success: false, messages: messages.UpdatePasswordFail });
      }
      const sendMail = await SendMail(req, res, email, 'Forgot Password', newPassword, userId);
      sendMail && result && res.status(200).send({ success: true, messages: 'Check your mail to get new password' });
    } catch (error) {
      return handleError.ServerError(error, res)
    }
  },

  changePassword: async (req, res) => {
    const userId = req.userIsLogged._id.toString();
    const passwordNew = req.body.password_New

    try {
      const result = await models.users.findOneAndUpdate(
        { _id: userId },
        { password: await models.users.hashPassword(passwordNew) },
        { new: true, upsert: true }
      );
      if (!result) {
        return res.status(400).send({ message: "Update that bai" });
      }
      return res.status(200).send({ success: true, message: 'Change Password Successfully!!!' });
    } catch (error) {
      return handleError.ServerError(error, res)
    }
  },

  setActive: async (req, res) => {
    const userId = req.query.id;
    try {
      if (!userId) {
        return res.status(400).send({ message: "not userId or isActive" });
      }
      const result = await models.users.findOneAndUpdate(
        { _id: userId },
        { isActive: true },
        { new: true, upsert: true }
      );
      return res.status(200).send({ message: "Update isActive thành công", result });
    } catch (error) {
      return handleError.ServerError(error, res)
    }
  },

  updateOneUserWeb: async (req, res)=>{
    try {
      let avatarUpload, isActive;
      let userUpdate = req.userIsLogged;
      const active = req.body.isActive;
  
      if(active === "true"){
        isActive = true;
      }else{
        isActive = false;
      }
  
      for (const role of userUpdate.roles) {
        if (role.name === "Moderator" || role.name === "Admin") {
          userUpdate =  req.query.id;
          break;
        } else {
          userUpdate = userUpdate._id;
          break;
        }
      }
  
      const user = await models.users.findById(userUpdate)
  
      if(req.file){
        const itemTrash = req.body.roles.pop();
        await cloudinary.uploader.destroy(user.images.avatar.id);
        avatarUpload = await cloudinary.uploader.upload(req.file?.path, folder);
        update={$set:{...req.body, isActive: isActive, updateAt: addDays(0), deleteAt: user.deleteAt, createAt: user.createAt, images: { avatar: { id: avatarUpload.public_id, url: avatarUpload.secure_url } }}}
      }else if (req.body.images){
        await cloudinary.uploader.destroy(user.images.avatar.id);
        avatarUpload = await cloudinary.uploader.upload(req.body.images, folder);
        update={$set:{...req.body, isActive: isActive, updateAt: addDays(0), deleteAt: user.deleteAt, createAt: user.createAt, images: { avatar: { id: avatarUpload.public_id, url: avatarUpload.secure_url } }}}
      }else {
        update={$set:{...req.body}}
      }
      
      const result = await models.users.findByIdAndUpdate(userUpdate, update, {new:true})
      if(!result){
       return res.status(200).send({success:false, message:messages.UpdateFail})
      }
      
      return res.status(200).send({data: result, success:true, message:messages.UpdateSuccessfully })
    } catch (error) {
      return handleError.ServerError(error, res)
    }
  },
  
  updateOneUserMobile: async (req, res) => {
    try {
      let update;
      let userIdLogin = req.userIsLogged._id;

      const { type } = req.query
      const { authorId, ebookId, chapterId, notify, deviceToken, coin } = req.body
      if (type) {
        switch (type) {
          case 'notify':
            update = { $push: { "notify": notify } }
            break
          case 'subscribe-author':
            update = { $addToSet: { "subscribe.author": authorId } }
            break
          case 'subscribe-ebooks':
            const user = await models.users.findById(userIdLogin);
            const containBookId = user?.subscribe?.ebooks.includes(ebookId)

            update = containBookId ? { $pull: { "subscribe.ebooks": ebookId } } : { $addToSet: { "subscribe.ebooks": ebookId } }
            break
          case 'subscribe-users':
            update = { $addToSet: { "subscribe.users": userIdLogin } }
            break
          case 'history-readed':
            update = { $addToSet: { "history.read.chapters": chapterId, "history.read.ebooks": ebookId } }
            break
          case 'delete-history-readed':
            const listChapter = await models.chapters.find({ ebooks: ebookId }, { name: 1 })
            const chapId = listChapter.map((item, index) => item._id.toString())
            update = { $pull: { "history.read.ebooks": ebookId, "history.read.chapters": { $in: chapId } } }
            break
          case 'history-download':
            update = {
              $addToSet: { "history.download.ebooks": ebookId },
              $addToSet: { "history.download.chapters": chapterId }
            }
            break;
          case "history-bought":
            update = { coin: coin, $addToSet: { "history.bought": chapterId } }
            break;

          case "deviceToken":
            update = { "deviceToken": deviceToken }
            break;
          case "updateCoin":
            if (coin == null) {
              break;
            }
            update = { "coin": coin }
            break;
          default: break;
        }


      }

      const result = await models.users.findByIdAndUpdate(userIdLogin, update, { new: true })
      if (!result) {
        return res.send({ success: false, message: messages.UpdateFail })
      }
      return res.send({ success: true, message: messages.UpdateSuccessfully })
    } catch (error) {
      return handleError.ServerError(error, res)
    }
  },


  updateOneUser: async (req, res)=>{
    try {
      let avatarUpload;
      let userUpdate = req.userIsLogged;

      if(req.file){
        await cloudinary.uploader.destroy(userUpdate.images.avatar.id);
        avatarUpload = await cloudinary.uploader.upload(req.file?.path, folder);
        update={$set:{...req.body, images: { avatar: { id: avatarUpload.public_id, url: avatarUpload.secure_url } }}}
      }else if (req.body.images){
        await cloudinary.uploader.destroy(userUpdate.images.avatar.id);
        avatarUpload = await cloudinary.uploader.upload(req.body.images, folder);
        update={$set:{...req.body, images: { avatar: { id: avatarUpload.public_id, url: avatarUpload.secure_url } }}}
      }else {
        update={$set:{...req.body}}
      }
      for (const role of userUpdate.roles) {
        if (role.name == "Moderator" || role.name == "Admin") {
          userUpdate =  req.body._id;
          break;
        } else {
          userUpdate = userUpdate._id;
          break;
        }
      }
      const result = await models.users.findOneAndUpdate(userUpdate, update, {new:true})
      if(!result){
       return res.status(200).send({success:false, message:messages.UpdateFail})
      }
      
      return res.status(200).send({data: result, success:true, message:messages.UpdateSuccessfully })
    } catch (error) {
      return handleError.ServerError(error, res)
    }
  },

  findOneUser: async (req, res) => {
    const id = req.userIsLogged._id;
    try {
      const data = await models.users.findOne({ _id: id }, { password: 0 }).populate('roles', 'name');
      if (data) {
        return res.status(200).send({ data: data, success: true, message: messages.GetDataSuccessfully });
      }
      else {
        return res.send({ success: false, message: messages.GetDataNotSuccessfully });
      }
    } catch (error) {
      return handleError.ServerError(error, res)
    }
  },

  findManyUser: async (req, res) => {
    try {
      Promise.all([
        models.users.count(),
        models.users.find({ deleted: false }, { password: 0 }).populate("roles")
      ]).then((result) => {
        const response = {
          count: result[0], data: result[1], success: true
        }
        return res.status(200).send(response);
      })
    } catch (error) {
      return handleError.ServerError(error, res)
    }
  },

  insertOneUser: async (req, res) => {
    const itemTrash = req.body.roles.pop();
    const active = req.body.isActive;
    let isActive;
    if (active.includes("true")) {
      isActive = true;
    } else {
      isActive = false;
    }
    try {
      const avatarUpload = await cloudinary.uploader.upload(req.file?.path, folder);
      const USER = new models.users({ ...req.body, isActive: isActive, images: { avatar: { id: avatarUpload.public_id, url: avatarUpload.secure_url } } });
      const result = await USER.save();
      if (result) {
        const response = {
          data: result,
          status: 200,
          message: 'insert one user successfully',
        }
        return res.status(200).send(response)
      }
    } catch (error) {
      return handleError.ServerError(error, res)
    }
  },

  removeOneUser: async (req, res) => {
    const option = { new: true };
    const id = req.query.id;
    const userFind = await models.users.findById(id);
    let row;

    try {

      if (userFind.deleted === true) {
        row = await models.users.findByIdAndUpdate(id, { deleted: false, deleteAt: null, updateAt: userFind.updateAt, createAt: userFind.createAt }, option);
      } else {
        row = await models.users.findByIdAndUpdate(id, { deleted: true, deleteAt: addDays(0), updateAt: userFind.updateAt, createAt: userFind.createAt }, option);
      }
      if (!row) {
        console.log(messages.NotFound);
        return res.status(404).send({ message: messages.NotFound + id });
      }
      console.log(messages.DeleteSuccessfully);
      return res.status(200).send({ message: messages.DeleteSuccessfully });
    } catch (error) {
      return handleError.ServerError(error, res)
    }
  },

  removeManyUser: async (req, res) => {
    const listDelete = req.body;
    try {
      const result = await models.users.updateMany(
        { "_id": { $in: listDelete } },
        { $set: { deleted: true, deleteAt: addDays(0) } },
        { new: true }
      );
      if (!result) {
        return res.status(400).send({ success: false, message: messages.DeleteFail });
      }
      const response = {
        success: true,
        message: messages.DeleteSuccessfully,
      };
      return res.status(200).send(response);
    } catch (error) {
      handleError.ServerError(error, res);
    }
  },

  

  getNotify: async (req, res) => {
    const userId =  req.userIsLogged._id.toString();
    try {
      const listNotify = await models.users.findById(userId, {notify:1}).populate('notify.idUser')

      if(!listNotify){
        return res.status(400).send({  success:false, message:messages.GetDataNotSuccessfully });
      }
      return res.status(200).send({ data:listNotify, success:true, message:messages.GetDataSuccessfully });
    } catch (error) {
      return handleError.ServerError(error, res)
    }
  },

  updateNotify: async (req, res) => {

    try {
      const idUserOrIdNotify = req.query.id;
      const type = req.query.type
      const device = req.query.device
      const content = req.query.content
      const idCommentOrReview = req.query.idCommentOrReview
      let imageUser = req.userIsLogged?.images?.avatar?.url;
      let displayName = req.userIsLogged?.displayName;
      let userIdLogin = req.userIsLogged?._id;
      let update
      let notify
      if (device == 'mobile') {
        if (idUserOrIdNotify == req.userIsLogged._id && type == 'push') {
          return res.status(400).send({ success: false, message: "Không tự thông báo" });
        }
        switch (type) {
          case 'push':

            notify = {
              _id: uuid.v1(),
              content: content,
              idUser: userIdLogin,            
              idCommentOrReview:idCommentOrReview,
              createAt: Date.now()
            }
            if(content == "Đã thích bình luận của bạn" || content == "Đã thích review của bạn"){
              const find = await models.users.find({$and:[
                {_id:idUserOrIdNotify},
                {notify: {$elemMatch: {idUser:userIdLogin, idCommentOrReview:idCommentOrReview}}}
              ]})  
              if(find.length > 0){
                return res.status(200).send({ success: false, message: "Đã có thông báo" });
              }           
                update = { $push: { "notify": notify } }
            }
            else{
              update = { $push: { "notify": notify } }
              
            }
            
            const result2 = await models.users.findByIdAndUpdate(idUserOrIdNotify, update, { new: true }).sort({ 'notify.createAt': -1 })
            if (!result2) {
              return res.status(400).send({ success: false, message: messages.UpdateFail });
            }
            return res.status(200).send({ data: result2, success: true, message: messages.UpdateSuccessfully });

          case 'pull':
            
          console.log("🚀 ~ file: user.js ~ line 322 ~ updateNotify: ~ pull",idUserOrIdNotify)

            update = { $pull: { "notify": { _id: idUserOrIdNotify.toString() } } }
            const result1 = await models.users.findByIdAndUpdate(userIdLogin, update, { new: true })
            if (!result1) {
              return res.status(400).send({ success: false, message: messages.UpdateFail });
            }
            return res.status(200).send({ data: result1, success: true, message: messages.UpdateSuccessfully });
          case 'seen':
            const result = await models.users.updateOne(
              { _id: userIdLogin, 'notify._id': idUserOrIdNotify },
              { $set: { "notify.$.seen": true } }
            )
            if (!result) {
              return res.status(400).send({ success: false, message: messages.UpdateFail })
            }
            return res.status(200).send({ success: true, message: messages.UpdateSuccessfully })

          default:
            break;
        }

      } else {
        return res.status(400).send({ success: false, message: "chưa có gì" });
      }

    } catch (error) {
      return handleError.ServerError(error, res)
    }


  },

  DeleteUserController,


};
