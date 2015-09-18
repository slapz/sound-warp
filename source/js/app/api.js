'use strict';

var utils = require(__dirname + '/utils'),
  qs = require('querystring');

require(__dirname + '/soundcloud');

module.exports = function() {
  var api = {
      SC: window.SC
    };

  api.init = function(token) {
    var config = require(__dirname + '/config');
    if (token) {
      config.access_token = token;
    }
    api.SC.initialize(config);
  };

  api.connect = function(callback) {
    var fn = function() {};
    window.onmessage = function(event) {
      if (event.origin === 'connect://') {
        try {
          var data = JSON.parse(event.data);
          if (utils.hasProp(data, 'location')) {
            var query = qs.parse(data.location.substring(data.location.indexOf('?') + 1)),
              state = query.state.split('#'),
              access_token = state[1].substring(state[1].indexOf('=') + 1);
            api.init(access_token);
            api.SC._connectWindow.close();
            window.onmessage = fn;
            return callback();
          }
        } catch (err) {
          window.onmessage = fn;
          return callback(err);
        }
      }
    };
    api.SC.connect(fn);
  };

  api.url = function(url) {
    return url + (url.indexOf('?') > -1 ? '&' : '?')
      + 'client_id=' + api.SC.clientId + '&oauth_token=' + api.SC.accessToken;
  };

  return api;
};
