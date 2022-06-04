const jwt = require("jsonwebtoken");
const message = require("../constants/Messages");
const config = require("../configs/token");
const handleError = require("../error/HandleError");
const models = require("../models");

const VerifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return handleError.TokenError(err, res);
    }
    req.userId = decoded.id;
    next();
  });
};


const accessPermission = async (req, res, next) => {
  // send an array into body the permissions you want
  const token = req.headers?.authorization;
  const permissions = req.body?.permissionsApp
  if (!token && !permissions) {
    next()
  } else if (token && !permissions) {
    return handleError.PermissionError(res)
  } else if (!token && permissions){  
    return handleError.NoTokenError(res)
  } else {
    jwt.verify(token, config.secret, async (err, decoded) => {
      if (err) {
        return handleError.TokenError(err, res);
      }
      const USER = await models.users.findById(decoded.id).populate('roles')
      if(USER){
        const newArray = USER.roles.map((role) => role.name)
        const accessPermission = permissions.filter(x => newArray.includes(x))
        if(accessPermission.length > 0){
          req.accessPermission = accessPermission; next()
        }else {
          return handleError.PermissionError(res)
        }
      }else {
        return handleError.NotFoundError(decoded.id, res)
      }
    })
  }
}


const CheckAuth = async (req, res, next) => {
  try {
    const id = req.userId;
    const userlogining = await models.users.findById(req.userId).populate(
      "roles"
    );
    if (!userlogining) {
      return handleError.NotFoundError(id, res);
    }
    const roleName = userlogining.roles[0].name;
    req.roleName = roleName;
    req.result = userlogining;
    next();
  } catch (error) {
    return handleError.ServerError(error, res);
  }
};

const CheckPermission = (req, res, next) => {
  const roleName = req.roleName;
  const roles = req.body.roles;
  const action = req.body.action;
  switch (roleName) {
    case "user": {
      return handleError.PermissionError(res);
    }
    case "admin": {
      action === "USER_ACTION"
        ? roles === "admin" || roles === "moderator"
          ? handleError.PermissionError(res)
          : roles === "user"
          ? next()
          : null
        : next();
    }
    case "moderator": {
      action === "USER_ACTION" && roles === "moderator"
        ? handleError.PermissionError(res)
        : next();
    }
    default: break;
  }
};

const VerifyPassword = async (req, res, next) => {
  try {
    const password = req.body.password;
    const hash = req.result.password;
    const verifyPassword = await models.users.verifyPassword(password, hash);
    if (verifyPassword !== undefined) {
      return handleError.HashPasswordError(verifyPassword, res);
    }
    next();
  } catch (error) {
    return handleError.ServerError(error, res);
  }
};

const VerifyUserName = async (req, res, next) => {
  try {
    const userName = req.body.userName;
    const type = req.body.type;
    const result = await models.users.findOne({userName}).populate("roles","-__v");
    if (type === "LOGIN_APP") {
      if (!result) {
        return handleError.NotFoundError(userName, res);
      }
      req.result = result;
      next();
    } else {
      if (result) {
        return handleError.AlreadyExistsError(userName, res);
      }
      next();
    }
  } catch (error) {
    return handleError.ServerError(error, res);
  }
};

const VerifyEmail = async (req, res, next) => {
  try {
    const email = req.body.email;
    const type = req.body.type;
    const USER = await models.users.findOne({ email: email });
    if (type === "CREATE_APP" && !USER) {
      next();
    }
    if (USER) {
      req.user = USER;
      next();
    }
  } catch (error) {
    return handleError.ServerError(error);
  }
};

const VerifyPhoneNumber = async (req, res, next) => {
  const phoneNumber = req.body.phoneNumber;
  try {
    const USER = await models.users.findOne({ phoneNumber });
    if (USER) {
      return handleError.AlreadyExistsError(phoneNumber, res);
    }
    next();
  } catch (error) {
    return handleError.ServerError(error);
  }
};

module.exports = {
  VerifyToken,
  CheckAuth,
  VerifyEmail,
  VerifyUserName,
  VerifyPassword,
  VerifyPhoneNumber,
  CheckPermission,
  accessPermission
};
