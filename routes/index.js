const models = require('../models')
const cloudinary = require('../configs/cloudnary')
const handleError = require('../error/HandleError')
const jwt = require("jsonwebtoken");
const configsToken = require('../configs/token');
const dataDefault = require('../functions/dataDefault');
const zalopay = require('../configs/zalopay');
const { addDays, randomDate } = require('../functions/globalFunc');

module.exports = app => {

  require('./auth/role')(app)
  require('./auth/user')(app)
  require('./auth/feature')(app)
  require('./auth/featureGroup')(app)
  require('./movie/cast')(app)
  require('./movie/movie')(app)
  require('./review/review')(app)
  require('./review/comment')(app)
  require('./storybook/ebooks')(app)
  require('./storybook/genre')(app)
  require('./storybook/author')(app)
  require('./storybook/chapter')(app)

  app.get('/layout/web-hook', (req, res) => {})

  app.get('/layout/form-change-password', (req, res) => {
    const token = req.query.token
    if (!token) {
      return handleError.NoTokenError(res)
    }else {
      jwt.verify(token, configsToken.secret, async (err, decoded) => {
        // should return if token error
        if (err) {
          res.render()
          // return handleError.TokenError(err, res)
        }
        else {
          res.render()
        }
      })
    }
  })

  app.get('/api/zalopay/findManyBank', zalopay.findListBank)

  app.get('/api/data-management/create-default-data', async (req, res) => {
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
            dataDefault()
            return res.send({success: true, messages: 'create default data'})
          }
        });
      })
    }
  })

  app.delete('/api/cloudinary-management/delete-one-image', async (req, res) => {
    try {
      const response = await cloudinary.uploader.destroy(req.query.id);
      response.result === 'ok' && res.send({message: 'delete successfully'});
      response.result === 'not found' && handleError.NotFoundError(req.query.id, res)
    } catch (error) {
      handleError.ServerError(error, res)
    }
  })


}