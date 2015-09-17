'use strict';

module.exports = function() {
  var api = {
      SC: require(__dirname + '/soundcloud')
    };

  api.init = function(token) {
    var config = require(__dirname + '/config').call(this);
    if (typeof token !== 'undefined') {
      config.accessToken = token;
    }
    api.SC.init(config);
  };

  api.connect = function(callback) {

    // remote.getGlobal('accessToken')

    var connectWindow = window.open(api.SC.getConnectUrl(), 'connect', 'width=400, height=600, min-width=400, min-height=600, resizable=false');
    watch(connectWindow, 'closed', function() {
      api.init(window.remote.getGlobal('accessToken'));
      callback();
    });
  };

  api.url = function(url) {
    return url + (url.indexOf('?') > -1 ? '&' : '?')
      + 'client_id=' + api.SC.clientId + '&oauth_token=' + api.SC.accessToken;
  };

  return api;
};
