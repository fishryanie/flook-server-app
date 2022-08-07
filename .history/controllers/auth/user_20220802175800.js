const models = require("../../models");
const cloudinary = require('../../configs/cloudnary')
const jwt = require("jsonwebtoken");
const SendMail = require("../../functions/SendMail");

const configsToken = require("../../configs/token");
const messages = require("../../constants/messages");
const handleError = require('../../error/HandleError');
const { generatePassword, addDays } = require("../../functions/globalFunc");
const folder = { folder: 'Flex-ticket/ImageUser' }


const RefreshTokenController = async (req, res) => {
  const { refreshToken: requestToken } = req.body;

  if (requestToken == null) {
    return res.status(403).json({ message: "Refresh Token is required!" });
  }

  try {
    let refreshToken = await RefreshToken.findOne({ token: requestToken });

    if (!refreshToken) {
      res.status(403).json({ message: "Refresh token is not in database!" });
      return;
    }

    if (RefreshToken.verifyExpiration(refreshToken)) {
      RefreshToken.findByIdAndRemove(refreshToken._id, {
        useFindAndModify: false,
      }).exec();

      res.status(403).json({
        message: "Refresh token was expired. Please make a new signin request",
      });
      return;
    }

    let newAccessToken = jwt.sign(
      { id: refreshToken.user._id },
      config.secret,
      {
        expiresIn: config.jwtExpiration,
      }
    );

    return res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: refreshToken.token,
    });
  } catch (err) {
    return res.status(500).send({ message: err });
  }
};

const RegisterByPhoneNumber = (req, res) => {}
const RegisterByGoogle = (req, res) => {}
const RegisterByFacebook = (req, res) => {}


const CreateNewController = async (req, res) => {
  const dataUser = req.body.userName;
  try {
    const userName = await models.users.findOne({userName: dataUser})
    if(userName){
      return res.status(400).send(userName);
    }
    const avatarUpload = await cloudinary.uploader.upload(req.file?.path, folder);
    const USER = new models({ ... req.body, avatarId: avatarUpload.public_id, avatar: avatarUpload.secure_url });
    const rolesName = await models.roles.find({ name: { $in: req.body.roles } });
    USER.roles = rolesName?.map((role) => role._id);
    const result = await USER.save();
    if(result){
      const response = {
        data: result,
        status: 200,
        messages: messages.CreateSuccessfully,
      }
      return res.status(200).send(response)
    }
  } catch (error) {
    return handleError.ServerError(error, res)
  }
};


const UpdateUserController = async (req, res) => {
  const id = req.params.id;
  const avatar = req.body.avatar;
  const option = { new: true };
  let avatarUpload
  try {
    const userFind = await models.users.findById(id);
    if(req.file){
      await cloudinary.uploader.destroy(userFind.avatarId);
      avatarUpload = await cloudinary.uploader.upload(req.file?.path, folder);
    }else{
      avatarUpload = await cloudinary.uploader.upload(avatar, folder);
      await cloudinary.uploader.destroy(userFind.avatarId);
    }
    const Users = new models.users({ ...req.body, _id: id, avatarId: avatarUpload?.public_id, avatar: avatarUpload.secure_url });
    const roles = await models.roles.find({ name: { $in: req.body.roles } });
    Users.roles = roles?.map((role) => role._id);
    const result = await models.users.findByIdAndUpdate(id, Users, option);
    if (!result) {
      return handleError.NotFoundError(id, res)
    }
    return res.status(200).send({ messages: messages.UpdateSuccessfully, data: result });
  } catch (error) {
    return handleError.ServerError(error, res)
  }
};

const AddListFavoriteController = async (req, res) => {
  const userId = req.userId;
  const movieId = req.body.movieId;
  try {
    const movie = await models.users.findOne({listMovieFavorite: { $eq: movieId }});
    const result = await models.users.findOneAndUpdate(
      { _id: userId },
      movie ? { $pull: { listMovieFavorite: movieId }} : { $push: { listMovieFavorite: movieId }},
      { new: true }
    );
    console.log(result.listMovieFavorite);
    return res.status(200).send(result.listMovieFavorite);
  } catch (error) {
    return handleError.ServerError(error, res)
  }
};

const ActiveUserController = async (req, res) => {
  const userId = req.query.id;
  try {
    if (!userId) {
      return res.status(400).send({ messages: "not userId or isActive" });
    }
    const result = await models.users.findOneAndUpdate(
      { _id: userId },
      { isActive: true },
      { new: true, upsert: true }
    );
    return res.status(200).send({ messages: "Update isActive thành công", result });
  } catch (error) {
    return handleError.ServerError(error, res)
  }
};

  const ForgotPasswordController = async (req, res) => {
  console.log("ForgotPasswordController")


    try {
      // const id = req.userIsLogged._id;
      const email = req.user.email
      // const email = 'phuocsanhtps@gmail.com'
      // console.log('email', email);
  
      const newPassword = generatePassword();
      const result = await models.users.findOneAndUpdate(
        { email: email },
        { password: await models.users.hashPassword(newPassword) },
        { new: true }
      );
      // console.log("🚀 ~ file: user.js ~ line 164 ~ ForgotPasswordController ~ result", result)
      if (!result) {
        
        return res.status(400).send({success:false, message: messages.UpdatePasswordFail });
      }
      // await SendMail(email, null, newPassword, false);
      const sendMail = await SendMail(req, res, email, 'ForgotPassword', newPassword);
  
      sendMail && result && res.status(200).send({ success: true, message: 'Check your mail to get password!!!' });
    } catch (error) {
      return handleError.ServerError(error, res)
    }
  };
  


const ChangePasswordController = async (req, res) => {
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
    return res.status(200).send({ data: result, success: true, message: 'Change Password Successfully!!!' });
  } catch (error) {
    return handleError.ServerError(error, res)
  }
};

const FindUserNotActive = async (req, res) => {
  const userRoleName = req.roleName;
  try {
    if (userRoleName === "admin" || userRoleName === "moderator") {
      const users = await models.users
      .find({ isActive: false })
      .populate("roles");
      if (users.length <= 0) {
        return res.status(404).send({ messages:messages.NotFound });
      }
      return res.status(200).send(users);
    }
  } catch (error) {
    return handleError.ServerError(error, res)
  }
};

const FindManyUser = async (req, res) => {
  try {    
    Promise.all([
      models.users.count(),
      models.users.find().populate("roles")
    ]).then((result) => {
      const response = {
        count: result[0], data: result[1], success: true
      }
      return res.status(200).send(response); 
    })
  } catch (error) {
    return handleError.ServerError(error, res)
  }
};

const FindByIdUserController = async (req, res) => {
  const id = req.userId;
  try {
    const data = await models.users.findById(id);
    data.length && res.status(200).send(data);
  } catch (error) {
    if (error.kind === "ObjectId") {
      return handleError.NotFoundError(id, res)
    } else {
      return handleError.ServerError(error, res)
    }
  }
};

const FindListMovieFavorite = async (req, res) => {
  try {
    const idUser = req.userId;
    const User = await models.users
    .findById(idUser)
    .populate("listMovieFavorite", "-__v");
    if (!User) {
      console.log(messages.NotFound);
      return res.status(404).send({ messages: messages.NotFound });
    }
    return res.status(200).send(User);
  } catch (error) {
    return handleError.ServerError(error, res)
  }
};

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
    console.log("🚀 ~ file: user.js ~ line 278 ~ Login: ~ result", result)
    
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
      coin:result.coin,
    };
    if(!result.isActive){
      return res.status(400).send({ success: false, message: messages.LoginFailed});
    }
    return res.status(200).send({data, success: true, message: messages.LoginSuccessfully});
  },

  Register: async (req, res) => {
    // console.log("newPass", newPassword)
    const newPassword = generatePassword()
   
    const email = req.body.email
    try {
      const USER = new models.users({
        email: email,
        username: email,
        password: newPassword
      })
      const rolesName = await models.roles.find({name: 'User'});
      USER.roles = rolesName?.map((role) => role._id);
      const register = await USER.save();
      const sendMail = await SendMail(req, res, email, 'Register', newPassword, register._id);
      
      if(sendMail && register){
        return res.status(200).send({data:register, success: true, message: 'Sign up successfully, check your mail to get password'});
      } 
    } catch (error) {
      // console.log("có lỗi")

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
        return res.status(400).send({ success: false, message: messages.RemoveNotSuccessfully });
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
  

  CreateNewController,
  RefreshTokenController,
  ActiveUserController,
  ForgotPasswordController,
  ChangePasswordController,
  UpdateUserController,
  DeleteUserController,
  FindManyUser,
  FindByIdUserController,
  FindUserNotActive,
  FindListMovieFavorite,
  AddListFavoriteController,
};
