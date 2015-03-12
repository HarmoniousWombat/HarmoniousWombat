'use strict';

var nodemon = require('gulp-nodemon');
var gulp = require('gulp');

gulp.task('default', function(){
  nodemon({script: 'server.js', ignore: 'node_modules/**/*.js'});
});