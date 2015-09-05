'use strict';

let gulp = require('gulp'),
  T = Object.create(null);

Object.defineProperty(T, 'tasks', {
  enumerable: false,
  configurable: false,
  writable: true,
  value: []
});

T.task = function(name, callback) {
  T.tasks.push(colors.cyan(name));
  return gulp.task(name, callback);
};

gulp.task('tasks', function() {
  let spacer = '\n - ';
  log('\nAvailable tasks:' + spacer + T.tasks.join(spacer));
});

module.exports = T;
