'use strict';

const BASE_PATH = global.BASE_PATH = __dirname;
const MODULES_PATH = global.MODULES_PATH = `${BASE_PATH}/node_modules`;
const SOURCE_PATH = global.SOURCE_PATH = `${BASE_PATH}/source`;
const LIBS_PATH = global.LIBS_PATH = `${BASE_PATH}/libs`;
const OUT_PATH = global.OUT_PATH = `${BASE_PATH}/dist`;
const TASKS_PATH = global.TASKS_PATH = `${BASE_PATH}/tasks`;

let gulp = require('gulp');
let fs = require('fs');
let gutil = require('gulp-util');
let packageInfo = JSON.parse(fs.readFileSync(`${BASE_PATH}/package.json`));
let tasks = [
  'build', 'dev', 'default'
];

require(`${TASKS_PATH}/helpers/gutil.js`)(gutil);

if (tasks.length === 0) {
  throw new Error('No tasks found!');
}

var task = null;
tasks.forEach(function(filepath) {
  task = require(`${TASKS_PATH}/${filepath}.js`);
  if (typeof task != 'function') {
    throw new Error(`Task: "${task}" is incorrectly defined!`);
  } else {
    task(gulp);
  }
});

gulp.task('test', tasks);
