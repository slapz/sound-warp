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

  api.URL_CLIENT = 1;
  api.URL_TOKEN = 2;
  api.URL_MIXED = 3;

  api.url = function(url, type) {
    url = url + (url.indexOf('?') > -1 ? '&' : '?');
    switch (type) {
      case 1:
      default:
        url = url + 'client_id=' + api.SC.options.client_id;
        break;
      case 2:
        url = url + 'oauth_token=' + api.SC.accessToken;
        break;
      case 3:
        url = url + 'client_id=' + api.SC.options.client_id;
        url = url + '&oauth_token=' + api.SC.accessToken;
        break;
    }
    return url;
  };

  return api;
};
