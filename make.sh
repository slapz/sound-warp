#!/usr/bin/env sh

ELECTRON='electron';
if [[ $1 -eq '-r' ]]; then
  ELECTRON='../electron/out/D/Electron.app/Contents/MacOS/Electron';
fi

gulp && $ELECTRON ./dist;
