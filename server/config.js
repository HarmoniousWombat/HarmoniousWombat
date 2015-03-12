var mongoose = require('mongoose');
var express = require('express');

// Serve client and connect to mongo
var connectionUrl = process.env.CUSTOMCONNSTR_MONGOLAB_URI || 'mongodb://localhost/recalljs';
mongoose.connect(connectionUrl);
var app = express();
app.use(express.static(__dirname+'/../client'));

// Routing
var userRouter = express.Router();
app.use('/users', userRouter);
require('./users/userrouter.js')(userRouter);

module.exports = app;