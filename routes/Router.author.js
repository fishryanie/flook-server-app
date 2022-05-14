const upload = require("../utils/UploadImage");
const middlewares = require('../middlewares')
const Controller = require('../controllers')

module.exports = app => {
  app.route('/api/author-management/getAuthor').get(Controller.author.findAuthor)


  app.post('/api/author-management/addAuthor',
    [
      upload.single("image")
    ],
    Controller.author.addAuthor)

}