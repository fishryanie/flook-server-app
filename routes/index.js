const models = require('../models')
const cloudinary = require('../configs/cloudnary')
const handleError = require('../error/HandleError')
const path = require('path');

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

  app.get('/api/test', (req, res) => { 
    res.json({messages: 'test'})
  })

  app.get("/", (req, res) => {
    const response = process.cwd() + '/views/web-hook.html'
    res.sendFile(response)
  });

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