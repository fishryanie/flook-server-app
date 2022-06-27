require('dotenv/config')
const cors = require("cors");
const morgan = require('morgan');
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const formatData = require('./functions/formatData')
const database = require('./configs/mongodb')
const path = require('path');

const app = express();
const corsOptions = {
  credentials: true,
  optionsSuccessStatus: 200,
  origin: 'http://localhost:3000'
};
app.use(cookieParser());

app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(bodyParser.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/uploads", express.static("uploads"));

app.use(morgan('dev'))

database.then(() => { 
  
}).catch(error => console.error(error))

require('./routes')(app)

formatData()

// if (process.env.NODE_ENV !== 'test') {
app.listen(process.env.PORT || 8000, "0.0.0.0" , () => console.info('Server is running on port ' + process.env.PORT || 8000));
// }

module.exports = app