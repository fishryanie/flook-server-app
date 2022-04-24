const upload = require("../utils/UploadImage");
const middlewares = require('../middlewares')
const Controller = require('../controllers')

module.exports = app => {

  app.get('/api/author-management/getAuthor',
    Controller.author.findAuthorController)

  app.post('/api/author-management/addAuthor',
    [
      upload.single("image")
    ],
    Controller.author.addAuthorController)

}