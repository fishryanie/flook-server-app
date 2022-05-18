require('dotenv/config')

module.exports = {
  port: process.env.PORT || '8888',
  userName: process.env.USERNAME,
  password: process.env.PASSWORD,
  mongodb: process.env.DATABASE,
  mongoUrlLocal: process.env.MONGO_URL_LOCAL + process.env.DATABASE,
  mongoUrlAlat: `mongodb+srv://${process.env.USERNAME}:${process.env.PASSWORD}@cluster0.lqsyp.mongodb.net/${process.env.DATABASE}?retryWrites=true&w=majority`,
  mongodbUrl: process.env.MONGO_URL_LOCAL + process.env.DATABASE || `mongodb+srv://${process.env.USERNAME}:${process.env.PASSWORD}@cluster0.lqsyp.mongodb.net/${process.env.DATABASE}?retryWrites=true&w=majority`,
}