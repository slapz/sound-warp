'use strict';

let rm = require('del'),
  vinylPaths = require('vinyl-paths'),
  pipe = require('./fast_pipe').pipe;

module.exports = function(target) {
  return function(next) {
    return pipe(target)
      .pipe(vinylPaths(rm));
  };
};
