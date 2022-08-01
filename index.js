require('dotenv/config')

const cors = require("cors");

const morgan = require('morgan');

const express = require("express");

const favicon = require('serve-favicon');

const cookieParser = require('cookie-parser');

const dataDefault = require('./functions/dataDefault');

const hbs = require('hbs');

const bodyParser = require("body-parser")

const apiString = require('./constants/api');

const messages = require('./constants/messages');

const database = require('./configs/mongodb')

const app = express();

const corsOptions = { credentials: true, optionsSuccessStatus: 204, origin: 'http://localhost:3000', method: 'GET, POST, PUT, DELETE HEAD, PATCH' };

app.use(cors(corsOptions));

app.use(cookieParser());

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/style'));  

app.use(favicon(__dirname + '/favicon.ico'));

app.use(morgan('dev'))

app.set('view engine', 'hbs');

app.set('views', './views')

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', req.header('origin') );
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get("/", (req, res) => res.render('index', apiString));

database.then(() => {

  // dataDefault()

  require('./routes')(app)

  console.log(messages.mongoDBSuccess);

}).catch(error => console.error(messages.mongoDBError, error))


if (process.env.NODE_ENV !== 'test') {
  app.listen(process.env.PORT || 8000, () => console.info('Server is running on port ' + process.env.PORT || 8000));
}

module.exports = app




