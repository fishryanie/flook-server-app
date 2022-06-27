const upload = require("../../functions/UploadImage");
const middlewares = require('../../middlewares')
const Controller = require('../../controllers')
const routesString = require('../../constants/routes')
const mongoose = require('mongoose')

module.exports = app => {
 
  app.get(routesString.findManyAuthor, Controller.author.findMany)
  
  app.post(routesString.insertOneAuthor,[
    upload.single("image"), 
    middlewares.auth.accessPermission()
  ],Controller.author.addAuthor)

}