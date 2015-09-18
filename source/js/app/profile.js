'use strict';

module.exports = function(app) {

  app.api.SC.get('/me', function(profile) {
    setVar('profile.username', profile.full_name || profile.username);
    setSrc('profile.avatar_url', profile.avatar_url);
  });

};
