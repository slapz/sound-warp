'use strict';

module.exports = function(app) {

  app.api.SC.get('/me', function(err, profile) {
    if (err) throw err;
    console.log(profile);
    setVar('profile.full_name', profile.full_name);
  });

};
