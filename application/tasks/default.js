'use strict';

module.exports = function(gulp) {

  let gs = require('gulp-sync')(gulp);
  let concat = require('gulp-concat');
  let replace = require('gulp-replace');
  let fs = require('fs');
  let vinylPaths = require('vinyl-paths');
  let rm = require('del');
  let cssBase64 = require('gulp-css-base64');
  let cssFont64 = require('gulp-cssfont64');
  let minifyHTML = require('gulp-minify-html');
  let minifyCSS = require('gulp-minify-css');
  let uglify = require('gulp-uglify');
  let gulpif = require('gulp-if');
  let argv = require('yargs').argv;

  const MINIFY_SOURCES = argv.minify || false;

  gulp.task('clean', function() {
    return gulp.src(`${OUT_PATH}/*`)
      .pipe(vinylPaths(rm))
      .pipe(gulp.dest(`${OUT_PATH}`));
  });

  gulp.task('deps:jquery', function() {
    return gulp.src([
      `${MODULES_PATH}/jquery/dist/jquery.js`
    ]).pipe(gulp.dest(`${OUT_PATH}/js/`));
  });

  gulp.task('deps:bootstrap:css', function() {
    return gulp.src([
      `${MODULES_PATH}/bootstrap/dist/css/bootstrap.css`
    ]).pipe(gulp.dest(`${OUT_PATH}/css/`));
  });

  gulp.task('deps:bootstrap:js', function() {
    return gulp.src([
      `${MODULES_PATH}/bootstrap/dist/js/bootstrap.js`
    ]).pipe(gulp.dest(`${OUT_PATH}/js/`));
  });

  gulp.task('deps:bootstrap:fonts', function() {
    return gulp.src([
      `${MODULES_PATH}/bootstrap/dist/fonts/*`
    ]).pipe(gulp.dest(`${OUT_PATH}/fonts/`));
  });

  gulp.task('deps:bootstrap', [
    'deps:bootstrap:css',
    'deps:bootstrap:js',
    'deps:bootstrap:fonts'
  ]);

  gulp.task('deps', [
    'deps:jquery',
    'deps:bootstrap'
  ]);

  gulp.task('sources:images', function() {
    return gulp.src([
      `${SOURCE_PATH}/images/*`
    ]).pipe(gulp.dest(`${OUT_PATH}/images`));
  });

  gulp.task('sources:css', function() {
    return gulp.src([
      `${SOURCE_PATH}/css/*`
    ]).pipe(gulp.dest(`${OUT_PATH}/css`));
  });

  gulp.task('sources:js', function() {
    return gulp.src([
      `${SOURCE_PATH}/js/*`
    ]).pipe(gulp.dest(`${OUT_PATH}/js`));
  });

  gulp.task('sources:html', function() {
    return gulp.src([
      `${SOURCE_PATH}/*.html`,
      `${SOURCE_PATH}/html/*.html`
    ]).pipe(gulp.dest(`${OUT_PATH}/`));
  });

  gulp.task('sources', [
    'sources:css',
    'sources:images',
    'sources:js',
    'sources:html'
  ]);

  gulp.task('build:css', function() {
    return gulp.src(`${OUT_PATH}/index.html`)
      /* Replace <link> with related source */
      .pipe(replace(/<link rel="stylesheet" href="([A-Za-z\/\.]+)\.css"[^>]*>/, function(match) {
        var error = null,
          asset = '',
          /* Get asset path */
          assetpath = match.replace(/<link(.*)href="([A-Za-z\/\:\.]+)\.css"[^>]*>/, '$2.css');

        if (assetpath === match) { // Path does not equal to match!
          error = 'Invalid asset!';
        }

        assetpath = `${OUT_PATH}/${assetpath}`.replace('/./', '/');

        try {
          let stat = fs.statSync(assetpath);
          if (stat.isFile() === false) {
            throw new Error(`File ${assetpath} was not found!`);
          }
        } catch (e) {
          error = e.message;
        }

        if (error == null) {
          asset = fs.readFileSync(assetpath, 'utf8');
          log(colors.blue('build:css'), `${assetpath}`);
          return `<style>${asset}</style>`;
        }

        log(colors.red(`build:css : ${error}`));
        return `<!-- ${error} -->`;
      })).pipe(gulp.dest(`${OUT_PATH}/.temp/`));
  });

  gulp.task('build:js', function() {
    return gulp.src(`${OUT_PATH}/.temp/index.html`)
      /* Replace <script> with related source */
      .pipe(replace(/<script(.*)src="([A-Za-z\/\.]+)\.js"[^>]*>/, function(match) {
        var error = null,
          asset = '',
          /* Get asset path */
          assetpath = match.replace(/<script(.*)src="([A-Za-z\/\:\.]+)\.js"[^>]*>/, '$2.js');

        if (assetpath === match) { // Path does not equal to match!
          error = 'Invalid asset!';
        }

        assetpath = `${OUT_PATH}/${assetpath}`.replace('/./', '/');

        try {
          let stat = fs.statSync(assetpath);
          if (stat.isFile() === false) {
            throw new Error(`File ${assetpath} was not found!`);
          }
        } catch (e) {
          error = e.message;
        }

        if (error == null) {
          asset = fs.readFileSync(assetpath, 'utf8');
          log(colors.blue('build:js'), `${assetpath}`);
          return `<script>${asset}</script>`;
        }

        log(colors.red(`build:js : ${error}`));
        return `<!-- ${error} -->`;
      })).pipe(gulp.dest(`${OUT_PATH}/`));
  });

  gulp.task('build:clean', function() {
    return gulp.src(`${OUT_PATH}/.temp`)
      .pipe(vinylPaths(rm))
      .pipe(gulp.dest(`${OUT_PATH}`));
  });

  gulp.task('uglify:fonts', function() {
    return gulp.src(`${OUT_PATH}/fonts/*.ttf`)
      .pipe(cssFont64())
      .pipe(gulp.dest(`${OUT_PATH}/fonts/`));
  });

  gulp.task('uglify:css', ['uglify:fonts'], function() {
    let opts = {
      keepSpecialComments: 0
    };
    return gulp.src([
        `${OUT_PATH}/css/*.css`,
        `${OUT_PATH}/fonts/*.css`
      ])
      .pipe(gulpif(MINIFY_SOURCES, minifyCSS(opts)))
      .pipe(concat('styles.css'))
      .pipe(cssBase64({
        baseDir: `${OUT_PATH}/images`,
        extensionsAllowed: ['.gif', '.svg', '.png']
      }))
      .pipe(gulp.dest(`${OUT_PATH}/css/`));
  });

  gulp.task('uglify:js', function() {
    return gulp.src([
        `${OUT_PATH}/js/jquery.js`,
        `${OUT_PATH}/js/bootstrap.js`,
        `${OUT_PATH}/js/app_*.js`
      ])
      .pipe(concat('scripts.js'))
      .pipe(gulpif(MINIFY_SOURCES, uglify()))
      .pipe(gulp.dest(`${OUT_PATH}/js/`));
  });

  gulp.task('uglify', [
    'uglify:css',
    'uglify:js'
  ]);

  gulp.task('build', gs.sync([
    'build:css',
    'build:js',
    'build:clean'
  ]));

  gulp.task('minify', function() {
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

  gulp.task('compile', gs.sync([
    'clean',
    'deps',
    'sources',
    'uglify',
    'build',
    'minify'
  ]), function(cb) {
    let src = [
      `${OUT_PATH}/*`,
      `${OUT_PATH}/.temp/**`,
      `!${OUT_PATH}/index.html`
    ];
    rm(src, cb);
  });

  gulp.task('default', ['compile']);

};
