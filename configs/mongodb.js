require('dotenv/config')
const mongoose = require('mongoose');


const mongooseUrlLocal = process.env.MONGO_URL_LOCAL + process.env.DATABASE

const mongooseUrlGloble = `mongodb+srv://${process.env.USERNAME}:${process.env.PASSWORD}@cluster0.lqsyp.mongodb.net/${process.env.DATABASE}?retryWrites=true&w=majority`;

const configsMongodb = {
  url: mongooseUrlLocal ,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
}
const database = new mongoose.connect(configsMongodb.url, configsMongodb.options)

module.exports = database;