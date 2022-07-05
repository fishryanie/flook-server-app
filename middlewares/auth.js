const jwt = require("jsonwebtoken");
const message = require("../constants/messages");
const config = require("../configs/token");
const handleError = require("../error/HandleError");
const models = require("../models");

const accessPermission = typefunc => async (req, res, next) => {
  const array=[], token = req.headers?.authorization;
  if (!token) {
    return handleError.NoTokenError(res)
  } else {
    jwt.verify(token, config.secret, async (err, decoded) => {
      // should return if token error
      if (err) return handleError.TokenError(err, res)
      // Find user is logged
      const userIsLogged = await models.users.findById(decoded.id).populate('roles')
      // Shold returns if no logged in user is found
      if (!userIsLogged) return handleError.NotFoundError(decoded.id, res)
      // Find feature default
      const feature = await models.features.find({featureName: typefunc})
      // Create a new feature if not found
      if (feature == '') await models.features.create({featureName: typefunc})
      // Compare featureRole and userRole
      else {
        feature[0].roles?.forEach(featureRole => {
          userIsLogged.roles?.forEach(userRole => {
            if (featureRole.toString() === userRole._id.toString()) {              
              array.push(featureRole)
            }
          }) 
        })
      }
      array.length > 0 ? next() : handleError.PermissionError(res)
    })
  }
}

const verifyLogin = async (username, password, done) => {
  try {
    console.log(username);
    const result = await models.users.findOne({username}).populate("roles","-__v");
    done(null, result ? result : false)
  } catch (error) {
    done(null, error)
  }
}


const verifyUserName = typeUserName => async (req, res, next) => {
  try {
    const username = req.body.username;  

    const result = await models.users.findOne({username}).populate("roles","-__v");
    
    if(typeUserName === 'login_app') {
      if (!result) return handleError.NotFoundError(username, res);
      req.result = result;
      next();
    } else {
      if (result) return handleError.AlreadyExistsError(username, res);
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
    if (typeEmail === 'create_new' && USER){
      return handleError.AlreadyExistsError(email, res)
    }else if(typeEmail === 'create_new' && !USER) {
      next()
    }
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
  verifyLogin,
  verifyUserName,
  VerifyPassword,
  VerifyPhoneNumber,
  accessPermission,
};
