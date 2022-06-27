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

  app.post('/api/update-image-chapter', async (req, res) => {
    try {
      models.chapters.findOneAndUpdate()
    } catch (error) {
      handleError.ServerError(error, res)
    }
  })

  app.get("/", (req, res) => {
    // res.sendFile('file:///Users/mac/Documents/Project/flook-server-app/coverage/lcov-report/index.html',  { root: __dirname });
    // res.send({message: path.join(__dirname.slice(0, 45), '/views/web-hook.html')})
    res.sendFile(path.join(__dirname.slice(0,45), '/views/web-hook.html'))
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