'use strict';

let gulp = require('gulp'),
  replace = require('gulp-replace'),
  pipe = require('./fast_pipe').pipe,
  getContents = require(`${TASKS_PATH}/functions/get_contents`);

module.exports = function(options) {
  if (Object.keys(options).length < 5) {
    throw new Error('Not enough arguments');
  }
  let target = options.target,
    dest = options.dest,
    pattern = options.pattern,
    type = options.type,
    baseDir = options.baseDir || OUT_PATH,
    tagName = type === 'css' ? 'style' : 'script';
  return function() {
    return pipe(target)
      .pipe(replace(pattern, function(match) {
        var path = match.replace(pattern, `$2.${type=='css'?'css':'js'}`);
        if (path === match) {
          throw new Error('Could not parse asset URL or path');
        }
        path = `${baseDir}/${path}`.replace('/./', '/');
        return getContents({
          path: path,
          success: function(content, filepath) {
            log(colors.blue(filepath));
            return `<${tagName}>${content}</${tagName}>`;
          }
        });
      }))
      .pipe(gulp.dest(dest));
  };
};
