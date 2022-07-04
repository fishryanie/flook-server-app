const jwt = require("jsonwebtoken");
const message = require("../constants/messages");
const config = require("../configs/token");
const handleError = require("../error/HandleError");
const models = require("../models");

const accessPermission = typefunc => async (req, res, next) => {
  console.log('typefunc', typefunc);

  const array=[], token = req.headers?.authorization;
  // console.log("token",token)
  if (!token) {
    return handleError.NoTokenError(res)
  } else {
    jwt.verify(token, config.secret, async (err, decoded) => {
      // should return if token error
      if (err) return handleError.TokenError(err, res)
      // Find user is logged
      console.time('log')
      const userIsLogged = await models.users.findById(decoded.id).populate('roles')
      // Shold returns if no logged in user is found
      if (!userIsLogged) return handleError.NotFoundError(decoded.id, res)
      // Find feature default

      let feature = await models.features.findOne({featureName: typefunc})
      // Create a new feature if not found
      if (!feature) {
        const role =  await  models.roles.findOne({name:"Admin"})
        feature = await models.features.create({featureName: typefunc, roles:[role._id]})
      }
      feature?.roles?.forEach(featureRole => {
        userIsLogged.roles?.forEach(userRole => {
          if (featureRole.toString() === userRole._id.toString()) {              
            array.push(featureRole)
          }
        }) 
      })

      req.userIsLoggedId = userIsLogged
      array.length > 0 ? next() : handleError.PermissionError(res)
      console.timeEnd('log')
    })
  }
}

const verifyUserName = typeUserName => async (req, res, next) => {
  try {
    const userName = req.body.userName;
    const result = await models.users.findOne({userName}).populate("roles","-__v");
    if(typeUserName === 'login_app') {
      if (!result) return handleError.NotFoundError(userName, res);
      req.result = result;
      next();
    } else {
      if (result) return handleError.AlreadyExistsError(userName, res);
      next();
    }
  } catch (error) {
    return handleError.ServerError(error, res);
  }
};

const VerifyEmail = typeEmail => async (req, res, next) => {
  try {
    const email = req.body.email;
    const USER = await models.users.findOne({ email: email });
    if (typeEmail === 'create_new' && !USER) next();
    if (USER) {
      req.user = USER;
      next();
    }
  } catch (error) {
    return handleError.ServerError(error);
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
  VerifyEmail,
  verifyUserName,
  VerifyPassword,
  VerifyPhoneNumber,
  accessPermission,
};
