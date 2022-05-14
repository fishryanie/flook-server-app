const { MODEL_ROLES, MODEL_USERS } = require("../../models");
const cloudinary = require('../../configs/cloudnary')
const jwt = require("jsonwebtoken");
const SendMail = require("../../utils/SendMail");
const configsToken = require("../../configs/token");
const messages = require("../../constants/messages");
const handleError = require('../../error/HandleError')
const generator = require("../../utils/Generator");
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

const RegisterController = async (req, res) => {
  const userName = req.body.userName;
  const email = req.body.email;
  const phoneNumber = req.body.phoneNumber;
  const password = req.body.password
  const passwordComfirm = req.body.passwordComfirm
  if(password !== passwordComfirm) {
    return res.status(400).send({messages: messages.NotMatchPassword})
  }
  try {
    const USER = new MODEL_USERS({ 
      userName, email, phoneNumber, password,
    });
    const rolesName = await MODEL_ROLES.find({name:'user'})
    console.log(rolesName)
    USER.roles = await rolesName?.map((role) => role._id)
    const result = await USER.save()
    await SendMail(email, null, null, result._id);
    result && res.status(200).send({messages: 'sign up successfully'});
  } catch (error) {
    return handleError.ServerError(error, res)
  }
};

const CreateNewController = async (req, res) => {

  const dataUser = req.body.userName;

  try {

    const userName = await MODEL_USERS.findOne({ userName: dataUser })
    if(userName){
      console.log("userName đã tồn tại!!!");
      return res.status(400).send(userName);
    }

    const avatarUpload = await cloudinary.uploader.upload(req.file?.path, folder);
    const USER = new MODEL_USERS({ ... req.body, avatarId: avatarUpload.public_id, avatar: avatarUpload.secure_url });
    
    const rolesName = await MODEL_ROLES.find({ name: { $in: req.body.roles } });
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
  console.log("update user");
  const option = { new: true };
  let avatarUpload
  try {
    const userFind = await MODEL_USERS.findById(id);
    if(req.file){
      await cloudinary.uploader.destroy(userFind.avatarId);
      avatarUpload = await cloudinary.uploader.upload(req.file?.path, folder);
    }else{
      avatarUpload = await cloudinary.uploader.upload(avatar, folder);
      await cloudinary.uploader.destroy(userFind.avatarId);
    }
    const Users = new MODEL_USERS({ ...req.body, _id: id, avatarId: avatarUpload?.public_id, avatar: avatarUpload.secure_url });
    const roles = await MODEL_ROLES.find({ name: { $in: req.body.roles } });
    Users.roles = roles?.map((role) => role._id);
    const result = await MODEL_USERS.findByIdAndUpdate(id, Users, option);
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
    const movie = await MODEL_USERS.findOne({listMovieFavorite: { $eq: movieId }});
    const result = await MODEL_USERS.findOneAndUpdate(
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
  const userId = req.params.id;
  try {
    if (!userId) {
      return res.status(400).send({ messages: "not userId or isActive" });
    }
    const result = await MODEL_USERS.findOneAndUpdate(
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
  try {
    const id = req.user._id
    const email = req.user.email
    const newPassword = generator();
    const result = await MODEL_USERS.findByIdAndUpdate(
      { _id: id },
      { password: await MODEL_USERS.hashPassword(newPassword)},
      { new: true }
    );
    if (!result) {
      return res.status(400).send({ messages: messages.UpdatePasswordFail });
    }
    await SendMail(email, null, newPassword, false);
  } catch (error) {
    return handleError.ServerError(error, res)
  }
};

const ChangePasswordController = async (req, res) => {
  const userId = req.userId;
  const passwordNew = req.result.password
  try {
    const result = await MODEL_USERS.findOneAndUpdate(
      { _id: userId },
      { password: await MODEL_USERS.hashPassword(passwordNew) },
      { new: true, upsert: true }
    );
    if (!result) {
      return res.status(400).send({ messages: "Update that bai" });
    }
    return res.status(200).send(result);
  } catch (error) {
    return handleError.ServerError(error, res)
  }
};

const FindUserNotActive = async (req, res) => {
  const userRoleName = req.roleName;
  try {
    if (userRoleName === "admin" || userRoleName === "moderator") {
      const users = await MODEL_USERS
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

const FindAllUserController = async (req, res) => {
  try {
    const role = await MODEL_ROLES.find({
      $or: [{ name: "admin" }, { name: "user" }],
    });
    let find = {};
    if (req.roleName === "moderator") {
      find = {
        $or: [
          { roles: { $in: role[0]["_id"] } },
          { roles: { $in: role[1]["_id"] } },
        ]
      };
    } else if (req.roleName === "admin") {
      find = { roles: { $in: role[0]["_id"] } };
    }
    const result = await MODEL_USERS.find(find).populate("roles");
    res.status(200).send(result);
  } catch (error) {
    return handleError.ServerError(error, res)
  }
};

const FindByIdUserController = async (req, res) => {
  const id = req.userId;
  try {
    const data = await MODEL_USERS.findById(id);
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
    const User = await MODEL_USERS
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
    const row = await MODEL_USERS.findByIdAndRemove(id).exec();
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
  LoginController: async (req, res) => {
    const result = req.result;
    const token = jwt.sign(
      { id: result.id }, 
      configsToken.secret, 
      { expiresIn: configsToken.jwtExpiration }
    );
    const authorities = [];
    for (let i = 0; i < result.roles.length; i++) {
      authorities.push("ROLE_" + result.roles[i].name.toUpperCase());
    }
    const data = {
      displayName: result.displayName,
      avatar: result.avatar,
      roles: authorities[0],
      accessToken: token,
    };
    return res.status(200).send({data, message:  messages.LoginSuccessfully});
  },

  RegisterController,
  CreateNewController,
  RefreshTokenController,
  ActiveUserController,
  ForgotPasswordController,
  ChangePasswordController,
  UpdateUserController,
  DeleteUserController,
  FindAllUserController,
  FindByIdUserController,
  FindUserNotActive,
  FindListMovieFavorite,
  AddListFavoriteController,
};
