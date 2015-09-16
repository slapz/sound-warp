#!/usr/bin/env sh

HS=$(command -v hs);

if [[ -z ${HS} ]]; then
  npm install --save-dev http-server
fi

${HS} -a localhost -p 3000 ./dist -o
