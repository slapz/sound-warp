(function(global) {

  'use strict';

  var app = Object.create(null);
    global.app = app;

  app.SC = require(__dirname + '/js/app/sc')();
  app.player = require(__dirname + '/js/app/player')();

  app.SC.get('/tracks/164497989', function(err, track) {
    if ( err ) {
      throw err;
    }

    app.player.load(app.SC.url(track.stream_url));

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

})(window);
