'use strict';

module.exports = function(app) {

  setVar('display.sub-row', 'Loading profile information...');

  app.api.SC.get('/me', function(profile) {
    setVar('profile.username', profile.full_name || profile.username);
    setSrc('profile.avatar_url', profile.avatar_url);

    setVar('display.sub-row', 'Profile information loaded');

    setVar('display.main-row', '&nbsp;');
    setVar('display.sub-row', '&nbsp;');
  });

};
