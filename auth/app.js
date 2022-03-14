var createError = require('http-errors');
var express = require('express');
var cors = require('cors');
var logger = require('morgan');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var signupApiRouter = require('./routes/api/v1/signup');
var signinApiRouter = require('./routes/api/v1/signin');
var feedApiRouter = require('./routes/api/v1/feed');

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.connect('mongodb://root:roottoor123!@localhost', { dbName: 'Zyou', useNewUrlParser: true });
var db = mongoose.connection;

app.use(cors());
app.use(logger('dev'));
app.use(express.json());

app.use('/api/v1/signup', signupApiRouter);
app.use('/api/v1/signin', signinApiRouter);
app.use('/api/v1/feed', feedApiRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  next();
});

module.exports = app;
