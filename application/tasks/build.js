'use strict';

module.exports = function(gulp) {

  let gs = require('gulp-sync')(gulp),
    concat = require('gulp-concat'),
    cssBase64 = require('gulp-css-base64'),
    cssFont64 = require('gulp-cssfont64'),
    minifyHTML = require('gulp-minify-html'),
    minifyCSS = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    gulpif = require('gulp-if'),
    argv = require('yargs').argv,
    task = require(`${TASKS_PATH}/helpers/task`).task,
    clean = require(`${TASKS_PATH}/helpers/clean`),
    lessc = require(`${TASKS_PATH}/helpers/compile_less`),
    inject = require(`${TASKS_PATH}/helpers/inject`),
    fpipe = require(`${TASKS_PATH}/helpers/fast_pipe`),
    pipe = fpipe.pipe,
    copy = fpipe.copy;

  let jsSources = [
    `${OUT_PATH}/js/jquery.js`,
    `${OUT_PATH}/js/bootstrap.js`,
    `${OUT_PATH}/js/watch.js`,
    `${OUT_PATH}/js/utils.js`,
    `${OUT_PATH}/js/chrome.js`,
    `${OUT_PATH}/js/app.js`
  ];

  const MINIFY_SOURCES = argv.minify || false;

  task('clean', clean(OUT_PATH));
  task('cleanup', clean([`${OUT_PATH}/css`, `${OUT_PATH}/fonts`, `${OUT_PATH}/js`, `${OUT_PATH}/less`]));
  task('deps:jquery', copy(`${MODULES_PATH}/jquery/dist/jquery.js`, `${OUT_PATH}/js/`));
  task('deps:bootstrap:css', copy(`${MODULES_PATH}/bootstrap/less/**/*`, `${OUT_PATH}/less/bootstrap/`));
  task('deps:bootstrap:js', copy(`${MODULES_PATH}/bootstrap/dist/js/bootstrap.js`, `${OUT_PATH}/js/`));
  task('deps:bootstrap:fonts', copy(`${MODULES_PATH}/bootstrap/dist/fonts/*`, `${OUT_PATH}/fonts/`));
  task('deps:bootstrap', ['deps:bootstrap:css', 'deps:bootstrap:js', 'deps:bootstrap:fonts']);
  task('deps:watchjs', copy(`${MODULES_PATH}/watchjs/src/watch.js`, `${OUT_PATH}/js/`));
  task('deps', ['deps:jquery', 'deps:bootstrap', 'deps:watchjs']);
  task('sources:images', copy(`${SOURCE_PATH}/images/*`, `${OUT_PATH}/images`));
  task('sources:less', copy([`${SOURCE_PATH}/less/*.less`, `${SOURCE_PATH}/less/**/*.less`], `${OUT_PATH}/less`));
  task('sources:css', copy(`${SOURCE_PATH}/css/**/*.css`, `${OUT_PATH}/css`));
  task('sources:js', copy(`${SOURCE_PATH}/js/*`, `${OUT_PATH}/js`));
  task('sources:html', copy([`${SOURCE_PATH}/*.html`, `${SOURCE_PATH}/html/*.html`], `${OUT_PATH}`));
  task('sources', ['sources:less', 'sources:css', 'sources:images', 'sources:js', 'sources:html']);
  task('preprocess:less', lessc([`${OUT_PATH}/less/main.less`], `${OUT_PATH}/css/`));
  task('inject:css', inject({
    target: `${OUT_PATH}/index.html`,
    dest: `${OUT_PATH}`,
    baseDir: `${OUT_PATH}`,
    type: 'css',
    pattern: /<link rel="stylesheet"(.*)href="([A-Za-z\/\:\.]+)\.css"[^>]*>/
  }));
  task('inject:js', inject({
    target: `${OUT_PATH}/index.html`,
    dest: `${OUT_PATH}`,
    baseDir: `${OUT_PATH}`,
    type: 'js',
    pattern: /<script(.*)src="([A-Za-z\/\:\.]+)\.js"[^>]*><\/script>/
  }));
  task('inject', gs.sync(['inject:css', 'inject:js']));
  task('prepare:sources', [
    'deps',
    'sources'
  ]);
  task('prepare:fonts', function() {
    return gulp.src(`${OUT_PATH}/fonts/*.ttf`)
      .pipe(cssFont64())
      .pipe(concat('fonts.css'))
      .pipe(gulp.dest(`${OUT_PATH}/css/`));
  });
  task('merge:css', function() {
    let opts = {
      keepSpecialComments: 0
    };
    return pipe(`${OUT_PATH}/css/*.css`)
      .pipe(gulpif(MINIFY_SOURCES, minifyCSS(opts)))
      .pipe(concat('styles.css'))
      .pipe(cssBase64({
        baseDir: `${OUT_PATH}/images`,
        extensionsAllowed: ['.gif', '.svg', '.png']
      }))
      .pipe(gulp.dest(`${OUT_PATH}/css`));
  });
  task('merge:js', function() {
    return gulp.src(jsSources)
      .pipe(concat('scripts.js'))
      .pipe(gulpif(MINIFY_SOURCES, uglify()))
      .pipe(gulp.dest(`${OUT_PATH}/js/`));
  });
  task('minify', function() {
    let opts = {
      empty: true,
      cdata: false,
      comments: false,
      conditionals: false,
      spare: true,
      quotes: false,
      loose: false
    };

    if (MINIFY_SOURCES) {
      return gulp.src(`${OUT_PATH}/index.html`)
        .pipe(minifyHTML(opts))
        .pipe(gulp.dest(`${OUT_PATH}`));
    }
  });
  task('build', gs.sync([
    'clean',
    'prepare:sources',
    'prepare:fonts',
    'preprocess:less',
    'merge:css',
    'merge:js',
    'inject',
    'minify',
    'cleanup'
  ]));
};
