const models = require('../models')
const cloudinary = require('../configs/cloudnary')
const handleError = require('../error/HandleError')
const path = require('path');
const jwt = require("jsonwebtoken");
const configsToken = require('../configs/token');
const formatData = require('../functions/formatData');
const zalopay = require('../configs/zalopay');
module.exports = app => {

  app.delete('/api/test-delete-image', async (req, res) => {
    try {
      const response = await cloudinary.uploader.destroy(req.query.id);
      response.result === 'ok' && res.send({message: 'delete successfully'});
      response.result === 'not found' && handleError.NotFoundError(req.query.id, res)
    } catch (error) {
      handleError.ServerError(error, res)
    } 
  })

  app.get('/api/data-management/create-sample-data', async (req, res) => {
    const token = req.query.token
    if (!token) {
      return handleError.NoTokenError(res)
    }else {
      jwt.verify(token, configsToken.secret, async (err, decoded) => {
        // should return if token error
        if (err) return handleError.TokenError(err, res)
        // Find user is logged
        const userIsLogged = await models.users.findById(decoded.id).populate('roles')
        // Shold returns if no logged in user is found
        if (!userIsLogged) return handleError.NotFoundError(decoded.id, res)
        
        userIsLogged.roles.forEach(role => {
          if( role.name === 'Moderator') {
            formatData()
            return res.send({success: true, messages: 'updated sample data'})
          }
        });
      })
    }
  })

  app.get('/api/zalopay/findManyBank', zalopay.findListBank)


  require('./auth/role')(app)
  require('./auth/user')(app)
  require('./auth/feature')(app)
  require('./auth/featureGroup')(app)
  require('./movie/cast')(app)
  require('./movie/movie')(app)
  require('./review/comment')(app)
  require('./storybook/ebooks')(app)
  require('./storybook/genre')(app)
  require('./storybook/author')(app)
  require('./storybook/chapter')(app)
}