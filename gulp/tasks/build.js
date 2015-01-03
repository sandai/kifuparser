"use strict";

var gulp = require('gulp'),
    concat = require('gulp-concat'),
    webpack = require('gulp-webpack'),
    stripCode = require('gulp-strip-code'),
    header = require('gulp-header'),
    runSequence = require('run-sequence'),
    config = require('../config');

gulp.task('build', function() {
  runSequence('clean', 'jshint:src', 'build:browser', 'build:dev');
});

gulp.task('build:browser', function () {
  return gulp.src(config.build.browser.src)
    .pipe(webpack(config.build.browser.webpack))
    .pipe(header(config.banner))
    .pipe(gulp.dest(config.dest));
});

gulp.task('build:dev', function () {
  return gulp.src(config.build.dev.src)
    .pipe(stripCode({
      pattern: new RegExp(config.build.dev.strip.header, "g")
    }))
    .pipe(stripCode({
      pattern: new RegExp(config.build.dev.strip.exports, "g")
    }))
    .pipe(concat(config.build.dev.filename, {newLine: '\n\n'}))
    .pipe(header(config.banner))
    .pipe(gulp.dest(config.dest));
});
