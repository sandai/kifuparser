"use strict";

var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    config = require('../config').jshint;

gulp.task('jshint:src', function () {
  return gulp.src(config.src).
    pipe(jshint()).
    pipe(jshint.reporter(stylish));
});

gulp.task('jshint:test', function () {
  return gulp.src(config.test).
    pipe(jshint()).
    pipe(jshint.reporter(stylish));
});

gulp.task('jshint:node', function () {
  return gulp.src(config.node).
    pipe(jshint()).
    pipe(jshint.reporter(stylish));
});
