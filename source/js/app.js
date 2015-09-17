(function(win) {

    'use strict';

    var app = {},
      initProfile = require(__dirname + '/js/app/profile'),
      connectOverlay = $('[data-section="connect"]');
    win.app = app;
    win.remote = require('remote');

    app.api = require(__dirname + '/js/app/api')();
    app.player = require(__dirname + '/js/app/player')();

    app.api.init();

    $('[data-trigger="connect.connect"]').on('click', function($event) {
      $event.preventDefault();
      app.api.connect(function() {
        connectOverlay.remove();

        initProfile(app);
      });
    });

    $('[data-trigger="connect.skip"]').on('click', function($event) {
      $event.preventDefault();
      connectOverlay.remove();
    });

})(window);

/** Example of how to play tracks
app.api.SC.get('/tracks/164497989', function(err, track) {
  if ( err ) {
    throw err;
  }

  app.player.load(app.api.url(track.stream_url));

  app.player.on('loadeddata', function($event) {
    app.player.controls.playPause.removeAttr('disabled');
  });

  app.player.on('play', function() {
    app.player.controls.playPause.find('.fa').removeClass('fa-play').addClass('fa-pause');
  });

  app.player.on('ended pause', function() {
    app.player.controls.playPause.find('.fa').removeClass('fa-pause').addClass('fa-play');
  });
});
*/
