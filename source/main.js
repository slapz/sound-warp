'use strict';

var app = require('app'),
  crashReporter = require('crash-reporter'),
  BrowserWindow = require('browser-window'),
  path = require('path'),
  protocol = null,
  filepath = null,
  url = null;

global.mainWindow = null;
global.accessToken = null;
global.globalShortcut = require('global-shortcut');
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

  global.mainWindow = new BrowserWindow({
    'width': 1050,
    'min-width': 1024,
    'height': 800,
    'min-height': 500,
    'title-bar-style': 'hidden-inset',
    'fullscreen': false
  });

  mainWindow.loadUrl('file://' + __dirname + '/index.html');
//  mainWindow.openDevTools();

  mainWindow.on('closed', function() {
    global.mainWindow = null;
  });
});

app.on('will-quit', function() {
  global.globalShortcut.unregisterAll();
});
