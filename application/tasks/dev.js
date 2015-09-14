'use strict';

module.exports = function(gulp) {

  let gs = require('gulp-sync')(gulp);

  gulp.task('dev', gs.sync([
    'clean',
    'prepare:sources',
    'prepare:fonts',
    'preprocess:scss',
    'merge:css',
    'merge:js'
  ]));

};
