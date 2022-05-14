const mongoose = require('mongoose');
const cors = require("cors");
const morgan = require('morgan');
const express = require("express");

const app = express();
const bodyParser = require("body-parser");
const SampleData = require('./utils/SampleData')
const configsMongodb = require('./configs/mongodb')
const corsOptions = {
  credentials: true,
  optionsSuccessStatus: 200,
  origin: '*'
};

app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(bodyParser.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.use(morgan('dev'))


mongoose.connect(configsMongodb.url, configsMongodb.options)
.then(() => {
  require('./routes')(app)
  // SampleData.insert_data()
  SampleData.edit_date_ebooks()
  app.listen(8000, () => console.log('Server is running on port 8000'));
}).catch(error => console.log(error))


module.exports = app


