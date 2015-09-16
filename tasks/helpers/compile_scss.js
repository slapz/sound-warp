'use strict';

let gdest = require('gulp').dest,
  sass = require('gulp-sass'),
  pipe = require('./fast_pipe').pipe;

module.exports = function(src, dest) {
  return function() {
    let sassPipe = sass();

    sassPipe.on('error', sass.logError);

    return pipe(src)
      .pipe(sassPipe)
      .pipe(gdest(dest));
  };
};
