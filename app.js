var createError = require('http-errors');
var express = require('express');
const cors = require("cors");
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var dbConnet = require('./config/db-connection');
var cron = require('node-cron');
require('dotenv').config();

const userRouter = require("./api/controllers/user-controller");
const placeRouter = require("./api/controllers/place-controller");
const workspaceRouter = require("./api/controllers/workspace-controller");
const reservationRouter = require("./api/controllers/reservation-controller");
const IoTNodeRouter = require("./api/controllers/IoTNode-controller");
const blobRouter = require("./api/controllers/blob-controller");

const UpdateIndicator = require("./abl/Automation/update-indicator");
const NotifyCompletion = require("./abl/reservation-abl/notification-of-completion");

var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

// Connect to MongoDB

var app = express();
app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.use('/user', userRouter);
app.use('/place', placeRouter);
app.use('/workspace', workspaceRouter);
app.use('/reservation', reservationRouter);
app.use('/iotnode', IoTNodeRouter);
app.use('/blob', blobRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  //set locals, only providing error in development
  //   res.locals.message = err.message;
  //   res.locals.error = req.app.get('env') === 'development' ? err : {};

  console.error(err);

  const status = err.status || 500;

  res.status(status).json({
    message: err.message,
    ...(req.app.get('env') === 'development' && { stack: err.stack })
  })

  // render the error page
  // res.status(err.status || 500);
  // res.render('error');
});

// Connect to database
dbConnet();
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function () {
  console.log('Connected to the database');
});

// This function updates workspace state and changes IoTNode led color
cron.schedule('30 * * * *', () => {
  UpdateIndicator();
});

cron.schedule('55 * * * *', () => {
  for (let i = 0; i < 3; i++) {
    setTimeout(() => {
      NotifyCompletion();
    }, i * 60000); // 60000 миллисекунд = 1 минута
  }
});

module.exports = app;
