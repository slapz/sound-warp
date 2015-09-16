'use strict';

var app = require('app'),
  BrowserWindow = require('browser-window'),
  mainWindow = null,
  options = {};

//require('crash-reporter').start();

app.on('window-all-closed', function() {
  if (process.platform != 'darwin') {
    app.quit();
  }
});

app.on('ready', function() {

  options = {
    width: 1050,
    height: 800
  };

  mainWindow = new BrowserWindow(options);
  mainWindow.loadUrl('file://' + __dirname + '/index.html');

  mainWindow.openDevTools();

  mainWindow.on('closed', function() {
    mainWindow = null;
  });
});
