'use strict';

const PREBUILD = process.env.ELECTRON_PREBUILD || false;
const BUILD = 'D';
const ELECTRON_PATH = `${BASE_PATH}/electron/`;

let exec = require(`${TASKS_PATH}/helpers/exec`),
  electron = PREBUILD ? 'electron' : `${ELECTRON_PATH}/out/${BUILD}/Electron.app/Contents/MacOS/Electron`,
  _electron = null,
  dist_path = `${BASE_PATH}/dist`,
  child = null;

if (_electron = process.env.ELECTRON && _electron) {
  electron = _electron;
}

module.exports = function(gulp) {

  gulp.task('run', ['build'], function(next) {
    exec(`${electron} ${dist_path}`, function(err) {
      return next(err);
    });
  });

};
