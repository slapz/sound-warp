'use strict';

module.exports = function() {
  var token = null,
    api = {
      SC: require('node-soundcloud')
    };

  api.init = function() {
    var config = require(__dirname + '/config').call(this);
    if (token !== null) {
      config.accessToken = token;
    }
    api.SC.init(config);
  };

  api.connect = function() {
    api.init();

    var remote = require('remote');
    var BrowserWindow = remote.require('browser-window');
    var authWindow = new BrowserWindow({
      'minWidth': 400,
      'width': 400,
      'minHeight': 600,
      'height': 600,
      'resizable': false,
      'center': true,
      'show': false,
      'always-on-top': true
    });
    authWindow.on('closed', function() {
      authWindow = null;
    });
    authWindow.loadUrl(api.SC.getConnectUrl());
    authWindow.show();
    remote.require('app').dock.bounce();
  };

  api.authorize = function(code) {
    api.SC.authorize(code, function(err, accessToken) {
      if (err) {
        throw err;
      }
      api.setToken(accessToken);
    });
  };

  api.setToken = function(value) {
    token = value;
  };

  api.getToken = function() {
    return token;
  };

  api.url = function(url) {
    return url + (url.indexOf('?') > -1 ? '&' : '?')
      + 'client_id=' + api.SC.clientId;
  };

  return api;
};
