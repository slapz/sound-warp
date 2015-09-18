'use strict';

var app = require('app'),
  crashReporter = require('crash-reporter'),
  BrowserWindow = require('browser-window'),
  path = require('path'),
  protocol = null,
  mainWindow = null,
  filepath = null,
  url = null;

global.accessToken = null;
app.commandLine.appendSwitch('--enable-file-cookies', 'true');

crashReporter.start();

app.on('window-all-closed', function() {
  if (process.platform != 'darwin') {
    app.quit();
  }
});

app.on('ready', function() {

  protocol = require('protocol');

  /* warp://index.html */
  protocol.registerFileProtocol('warp', function(req, callback) {
    url = req.url.substring(7);
    filepath = path.normalize(__dirname + '/' + url);
    console.log('warp:', url, filepath);
    callback(filepath);
  }, function(error) {
    if (error) console.error('Failed to register protocol "warp":', error);
  });

  /* connect://soundcloud */
  protocol.registerFileProtocol('connect', function(req, callback) {
    global.SOUNDCLOUD_CONNECT_URL = req.url;
    callback(path.normalize(__dirname + '/connect/index.html'));
  }, function(error) {
    if (error) console.error('Failed to register protocol "connect":', error);
  });

  mainWindow = new BrowserWindow({
    'width': 1050,
    'min-width': 1050,
    'height': 800,
    'min-height': 800
  });

  mainWindow.loadUrl('file://' + __dirname + '/index.html');
//  mainWindow.openDevTools();

  mainWindow.on('closed', function() {
    mainWindow = null;
  });
});
