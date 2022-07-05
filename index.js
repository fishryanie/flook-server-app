require('dotenv/config')
const cors = require("cors");
const morgan = require('morgan');
const express = require("express");
const favicon = require('serve-favicon');
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const formatData = require('./functions/formatData')
const database = require('./configs/mongodb')
const path = require('path');
const routes = require('./routes');

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

app.use(favicon(__dirname + '/favicon.ico'));

app.use(morgan('dev'))

database.then(() => {
  formatData()

  console.log('Database connected');
}).catch(error => console.error(error))

require('./routes')(app)




if (process.env.NODE_ENV !== 'test') {
app.listen(process.env.PORT || 8000 , () => console.info('Server is running on port ' + process.env.PORT || 8000));
}


function subStringX(value){
  var flag = true;
  var mess = '';
  var str = value.toString();
  if(str.trim() == ''){
    mess = 'Empty'
  } else {
    mess = str.substring(str.lastIndexOf('/')+1,str.length);
  }
    return mess;
}

const routesString = require('./constants/routes')
console.log(subStringX(routesString.changePassword))