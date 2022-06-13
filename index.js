require('dotenv/config')
const cors = require("cors");
const morgan = require('morgan');
const express = require("express");
const bodyParser = require("body-parser");
const sampleData = require('./functions/sampleData')
const database = require('./configs/mongodb')
const app = express();
const corsOptions = {
  credentials: true,
  optionsSuccessStatus: 200,
  origin: 'http://localhost:3000'
};
app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(bodyParser.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.use(morgan('dev'))

database.then(() => {
  require('./routes')(app)

  // sampleData()
  if (process.env.NODE_ENV !== 'test') {
    app.listen(process.env.PORT || 8000, () => console.log('Server is running on port ' + process.env.PORT));
  }
}).catch(error => console.error(error))


module.exports = app