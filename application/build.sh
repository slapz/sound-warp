#!/usr/bin/env sh

[[ ! -d "./node_modules" ]] && npm install > ./logs/npm.log;
./node_modules/.bin/gulp --minify > ./logs/gulp.log;
