var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var express = require('express');

// Serve client and connect to mongo
var connectionUrl = process.env.CUSTOMCONNSTR_MONGOLAB_URI || 'mongodb://localhost/recalljs';
mongoose.connect(connectionUrl);
var app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(__dirname+'/../client'));

// Routing
var userRouter = express.Router();
var problemRouter = express.Router();
app.use('/users', userRouter);
app.use('/problems', problemRouter);
require('./users/userRoutes.js')(userRouter);
require('./problems/problemRoutes.js')(problemRouter);

module.exports = app;