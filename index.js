require('dotenv/config')

const cors = require("cors");

const morgan = require('morgan');

const express = require("express");

const favicon = require('serve-favicon');

const cookieParser = require('cookie-parser');

const formatData = require('./functions/formatData');

const hbs = require('hbs');

const bodyParser = require("body-parser")

const passport = require('passport');

const middlewares = require('./middlewares')

const handleError = require('./error/HandleError');

const routesString = require('./constants/routes');

const messages = require('./constants/messages');

const database = require('./configs/mongodb')

const models = require('./models')

const LocalStrategy = require('passport-local').Strategy;

const path = require('path');

const zalopay = require('./configs/zalopay');

const app = express();

const corsOptions = { credentials: true, optionsSuccessStatus: 200, origin: 'http://localhost:3000' };

app.use(cors(corsOptions));

app.use(cookieParser());

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/style'));  

app.use(favicon(__dirname + '/favicon.ico'));

app.use(morgan('dev'))

app.set('view engine', 'hbs');

app.set('views', './views')

app.get("/", (req, res) => res.render('web-hook', routesString));

database.then(() => {

  formatData()

  require('./routes')(app)

  console.log(messages.mongoDBSuccess);

}).catch(error => console.error(messages.mongoDBError, error))

if (process.env.NODE_ENV !== 'test') {
  app.listen(process.env.PORT || 8000, () => console.info('Server is running on port ' + process.env.PORT || 8000));
}

module.exports = app




