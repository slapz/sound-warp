'use strict';

var qs          = require('querystring');
var hostApi     = 'api.soundcloud.com';
var hostConnect = 'https://soundcloud.com/connect';

module.exports = (function() {

  /*
   * Initialize with client id, client secret and redirect url.
   *
   * @constructor
   */
  function SoundCloud() {
    // Not yet authorized or initialized by default
    this.isAuthorized = false;
    this.isInit = false;
  }

  /* ====================================================== */

  /*
   * Initialize SoundCloud object with the necessary information:
   * - client ID
   * - client secret
   * - redirect URI
   *
   * @param {Object} options
   */
  SoundCloud.prototype.init = function(options) {
    this.clientId = options.id;
    this.clientSecret = options.secret;
    this.redirectUri = options.uri;

    if ( options.accessToken ) {
      this.setToken(options.accessToken);
    }

    this.isInit = true;
  };

  /* ====================================================== */

  /*
   * Get the config data needed to build a connect url
   *
   * @return {Object} The required data
   */
  SoundCloud.prototype.getConfig = function() {
    return {
      client_id: this.clientId,
      client_secret: this.clientSecret,
      redirect_uri: this.redirectUri,
      response_type: 'code',
      scope: 'non-expiring'
    };
  };

  /*
   * Get the url to SoundCloud's authorization/connection page
   *
   * @param {Object} options
   * @return {String}
   */
  SoundCloud.prototype.getConnectUrl = function(options) {
    if (!options) { options = this.getConfig(); }

    return hostConnect + '?' + (options ? qs.stringify(options) : '');
  };

  /* ====================================================== */

  /*
   * Save OAuth access token on SoundCloud object
   *
   * @param {String} token
   */
  SoundCloud.prototype.setToken = function(token) {
    this.accessToken = token;
    this.isAuthorized = true;
  };

  /*
   * Save SoundCloud user ID on SoundCloud object
   *
   * @param {String} id
   */
  SoundCloud.prototype.setUser = function(id) {
    this.userId = id;
  };

  /* ====================================================== */


  /*
   * Authorize with SoundCloud API and obtain OAuth token
   * for later requests, if not already authorized.
   * http://developers.soundcloud.com/docs/api/guide#authentication
   *
   * @param {String} code sent by SoundCloud via the redirect_uri
   * @param {Function} callback(error, accessToken)
   */
  SoundCloud.prototype.authorize = function(code, callback) {
    var options;

    callback = callback || function () {};

    if ( this.isInit ) {
      options = {
        uri: hostApi,
        path: '/oauth2/token',
        method: 'POST',
        qs: {
          'client_id': this.clientId,
          'client_secret': this.clientSecret,
          'grant_type': 'authorization_code',
          'redirect_uri': this.redirectUri,
          'code': code
        }
      };

      request(options, function (error, data) {
        if ( error ) {
          callback(error);
        } else {
          this.setToken(data.access_token);
          callback(null, data.access_token);
        }
      }.bind(this));
    } else {
      throw 'SoundCloud must first be initialized with a client ID, a client secret, and a redirect URI.';
    }
  };

  /* ====================================================== */

  /*
   * Make a call to the SoundCloud API
   *
   * @param {String} path
   * @param {Function} callback(error, data)
   * @return {Request}
   */

  SoundCloud.prototype.get = function(path, params, callback) {
    this.makeCall('GET', path, params, callback);
  };

  SoundCloud.prototype.post = function(path, params, callback) {
    this.makeCall('POST', path, params, callback);
  };

  SoundCloud.prototype.put = function(path, params, callback) {
    this.makeCall('PUT', path, params, callback);
  };

  SoundCloud.prototype.delete = function(path, params, callback) {
    this.makeCall('DELETE', path, params, callback);
  };

  /* ====================================================== */

  SoundCloud.prototype.makeCall = function(method, path, userParams, callback) {
    var params;

    if ( path && path.indexOf('/') === 0 ) {
      if ( !callback || typeof callback !== 'function' ) {
        callback = userParams; // callback must be the third parameter
        params = {};
      } else {
        params = userParams;
      }

      callback = callback || function () {};
      params.client_id = this.clientId;
      params.format = 'json';
      if (this.accessToken) {
        params.oauth_token = this.accessToken;
      }

      return request({
        method: method,
        uri: hostApi,
        path: path,
        qs: params
      }, callback);
    } else {
      callback({
        message: 'Invalid path: ' + path
      });

      return false;
    }
  };

  /* ====================================================== */

  function request(data, callback) {
    var qsdata = (data.qs) ? qs.stringify(data.qs) : '';
    var paramChar = data.path.indexOf('?') >= 0 ? '&' : '?';
    var options = {
      hostname: data.uri,
      path: data.path + paramChar + qsdata,
      method: data.method
    };
    var req;
    var body;

    if ( data.method === 'POST' ) {
      options.path = data.path;
      options.headers = {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Content-Length': qsdata.length
      };
    }

    req = $.ajax({
      url: 'https://' + options.hostname + '/' + data.path,
      method: options.method,
      headers: options.headers,
      data: qsdata,
      complete: function(xhr, textStatus) {
        body = xhr.responseText;
        if (typeof body !== 'object') {
          try {
            body = JSON.parse(body);
          } catch (e) {
            callback(e, body);
          }
        }
        if (xhr.status >= 400) {
          callback(body.errors, body);
        } else {
          callback(undefined, body);
        }
      },
      error: function(xhr, textStatus, errorThrown) {
        callback(errorThrown);
      }
    });

    return req;
  }

  /* ====================================================== */

  return new SoundCloud();

})();
