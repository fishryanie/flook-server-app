const mongoose = require('mongoose');
const { mongoUrlLocal, mongoUrlAlat } = require('./service')

const configsMongodb = {
  url: mongoUrlLocal ,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
}

const database = mongoose.connect(configsMongodb.url, configsMongodb.options)


module.exports = database;