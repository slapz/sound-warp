'use strict';

module.exports = function(gulp) {

  let replace = require('gulp-replace');
  let fs = require('fs');
  let vinylPaths = require('vinyl-paths');
  let rm = require('del');

  gulp.task('debug:copy-deps', function() {
    return gulp.src([
      `${MODULES_PATH}/jquery/dist/jquery.js`,
      `${MODULES_PATH}/bootstrap/dist/css/bootstrap.css`,
      `${MODULES_PATH}/bootstrap/dist/js/bootstrap.js`,
      `${MODULES_PATH}/bootstrap/dist/fonts/*`
    ]).pipe(gulp.dest(`${OUT_PATH}/temp`));
  });

  gulp.task('debug:css', function() {
    return gulp.src(`${SOURCE_PATH}/css/*`)
      .pipe(gulp.dest(`${OUT_PATH}/Debug/css`));
  })

  gulp.task('debug:html', function() {
    return gulp.src(`${SOURCE_PATH}/index.html`)
      .pipe(replace(/<link rel="stylesheet" href="([A-Za-z\/\.]+)\.css"[^>]*>/, function(match) {
        match = match.substring(match.indexOf('href')).replace('"', '').replace('href=', '');
        match = match.substring(0, match.indexOf('"')).replace(/(\.\/)/g, '');

        var error = null;
        var style = '';
        let filepath = `${OUT_PATH}/Debug/${match}`;
        var stat = {isFile: function() { return false; }};

        try {
          stat = fs.statSync(filepath);
        } catch (e) {
          error = e.message;
        }

        if (error === null && stat.isFile()) {
          style = fs.readFileSync(filepath, 'utf8');
          return `<style>${style}</style>`;
        }

        return `<!-- File ${filepath} does not exists! -->`;
      }))
      .pipe(gulp.dest(`${OUT_PATH}/Debug`));
  });

  gulp.task('debug', ['debug:css', 'debug:html'], function() {
    return gulp.src([
      `${OUT_PATH}/Debug/css`,
      `${OUT_PATH}/Debug/js`
    ]).pipe(vinylPaths(rm));
  });

};
