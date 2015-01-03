"use strict";

var gulp = require('gulp'),
    karma = require('gulp-karma'),
    config = require('../config').karma;

gulp.task('karma', ['jshint:test'], function () {
  return gulp.src(config.src)
    .pipe(karma(config.options))
    .on('error', function(err) {
      // Make sure failed tests cause gulp to exit non-zero
      throw err;
    });
});
