const upload = require("../utils/UploadImage");
const middlewares = require('../middlewares')
const Controller = require('../controllers')
const mongoose = require('mongoose')

module.exports = app => {
  app.get('/api/author-management/getAuthor', Controller.author.findMany)



  app.post('/api/author-management/addAuthor',[
    upload.single("image")
  ],Controller.author.addAuthor)

}