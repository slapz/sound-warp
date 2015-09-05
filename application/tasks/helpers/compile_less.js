'use strict';

let gdest = require('gulp').dest,
  less = require('gulp-less'),
  pipe = require('./fast_pipe').pipe;

module.exports = function(src, dest) {
  return function() {
    return pipe(src)
      .pipe(less())
      .pipe(gdest(dest));
  };
};
