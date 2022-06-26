const models = require('../models')
const cloudinary = require('../configs/cloudnary')
const handleError = require('../error/HandleError')

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
    res.send({ message: "Welcome to Flook-app." });
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