(function(win) {

    'use strict';

    var app = {},
      connectOverlay = $('[data-section="connect"]');
    win.app = app;
    win.remote = require('remote');

    app.api = require(__dirname + '/js/app/api')();
    app.player = require(__dirname + '/js/app/player')();
    app.display = require(__dirname + '/js/app/display')();
    app.profile = require(__dirname + '/js/app/profile')();

    app.display.reset();
    app.api.init();

    app.testPlayback = function(id) {
      app.api.SC.get('/tracks/' + id, function(track) {

        app.player.load(track);

        app.player.on('loadeddata', function($event) {
          app.player.controls.playPause.removeAttr('disabled');
        });

        app.player.on('play', function() {
          app.player.controls.playPause.find('.fa').removeClass('fa-play').addClass('fa-pause');
        });

        app.player.on('ended pause', function() {
          app.player.controls.playPause.find('.fa').removeClass('fa-pause').addClass('fa-play');
        });

        app.player.audio.play();
      });
    };

    $('[data-trigger="connect.connect"]').on('click', function($event) {
      $event.preventDefault();
      app.display.display('Connecting to SoundCloud...', 'Authenticating...');
      app.api.connect(function(err) {
        if (err) throw err;

        app.profile.load(function() {
          app.display.setSubTitle('Waiting for profile information...');
          if (app.profile.isEmpty()) {
            app.display.setTitle('Could not connect to SoundCloud!');
            app.display.setSubTitle('Authentication canceled!');
            return false;
          }

          setVar('profile.username', app.profile.get('full_name') || app.profile.get('username'));
          setSrc('profile.avatar_url', app.profile.get('avatar_url'));

          connectOverlay.remove();
          app.display.reset();

          $('[data-track-id]').on('click', function() {
            $('[data-track-id]').removeClass('playback-current');
            app.testPlayback($(this).data('track-id'));
            $(this).addClass('playback-current');
          });
        });
      });
    });

})(window);
