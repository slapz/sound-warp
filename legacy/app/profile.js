'use strict';

module.exports = function() {

  function Profile() {
    this.reset();
  };

  Profile.prototype._profile = Object.create(null);

  Profile.prototype.reset = function() {
    this._profile = Object.create(null);
  };

  Profile.prototype.load = function(callback) {
    var _this = this;
    app.api.SC.get('/me', function(profile) {
      if (profile) {
        _this._profile = profile;
      }
      callback(_this._profile);
    });
  };

  Profile.prototype.getData = function() {
    return this._profile;
  };

  Profile.prototype.get = function(key) {
    if (this._profile && Object.keys(this._profile).indexOf(key) > -1) {
      return this._profile[key];
    }
    return null;
  };

  Profile.prototype.isEmpty = function() {
    return Object.keys(this._profile).length === 0;
  };

  return new Profile();
};
