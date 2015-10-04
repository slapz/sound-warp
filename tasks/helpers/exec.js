'use strict';

let exec = require('child_process').exec,
  child = null;

module.exports = function(command, callback) {
  log(`${command}`);
  child = exec(command, function(err, stdout, stderr) {
    log(stdout);
    log(stderr);
    if (err !== null) {
      console.error(`Error occured while executing "${command}":`, err);
    }
    callback.call(this, err, stdout, stderr, command, child);
  });
  return child;
};
