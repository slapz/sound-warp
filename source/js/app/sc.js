'use strict';

var SC = require('node-soundcloud');
var config = require(__dirname + '/js/app/config')();

module.exports = function() {
  // Initialize client
  SC.init(config);

  SC.url = function(url) {
    return url + (url.indexOf('?') > -1 ? '&' : '?') + 'client_id=' + SC.clientId
  };

  return SC;
};
