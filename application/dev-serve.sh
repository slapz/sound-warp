#!/usr/bin/env sh

HS=$(command -v hs);
if [[ -z ${HS} ]]; then
  npm install --save-dev http-server
fi
[[ ! -d "./node_modules" ]] && npm install > ./logs/npm.log;
./node_modules/.bin/gulp dev;
${HS} -a localhost -p 3000 ./dist -o
