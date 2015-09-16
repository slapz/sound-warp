'use strict';

let gulp = require('gulp');

module.exports = {
  pipe: function(src) {
    return gulp.src(src);
  },
  copy: function(src, dest) {
    return function() {
      return module.exports.pipe(src).pipe(gulp.dest(dest));
    };
  }
}
