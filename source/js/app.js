(function(win) {

    'use strict';

    var app = {},
      playlist = require(__dirname + '/js/app/playlist'),
      connectOverlay = $('[data-section="connect"]'),
      utils = require(__dirname + '/js/app/utils');
    win.app = app;
    win.remote = require('remote');

    app.api = require(__dirname + '/js/app/api')();
    app.player = require(__dirname + '/js/app/player')();
    app.Playlist = playlist.Playlist;
    app.Track = playlist.PlaylistTrack;
    app.playlist = new app.Playlist();
    app.display = require(__dirname + '/js/app/display')();
    app.profile = require(__dirname + '/js/app/profile')();
    app.viewport = $('main.viewport');

    app.display.reset();
    app.api.init();

    /* @TODO: Implement playlist loading function with callback */
    function loadPlaylist() {
      app.display.setTitle('Loading stream...');
      app.display.setSubTitle('0 / 0');
      var data = {
          tracks: [],
          loaded: 0,
          followings: [],
          followings_loaded: 0
        },
        watcher = function() {
          if (data.loaded === data.tracks.length) {
            app.playlist.render(app.viewport.find('[data-section="stream"]'));

            app.player.init();
            app.player.controls.playPause.removeAttr('disabled').on('click', function($event) {
              app.playlist.play();
            });

            app.player.controls.previous.on('click', function($event) {
              $event.preventDefault();
              app.player.stop();
              app.playlist.previous();
              app.playlist.play();
              app.player.controls.next.removeAttr('disabled');
            });

            app.player.controls.next.removeAttr('disabled');
            app.player.controls.next.on('click', function($event) {
              $event.preventDefault();
              app.player.stop();
              app.playlist.next();
              app.playlist.play();
              app.player.controls.previous.removeAttr('disabled');
            });

            app.player.controls.volume.on('input change', function() {
              app.player.setVolume($(this).val());
            });

            $('[data-track-id]').on('click', function() {
              app.player.stop();
              app.playlist.setCurrentTrack($(this).data('track-id'));
              app.playlist.play();
            });

            unwatch(data, 'loaded', watcher);
            app.display.reset();
          }
        };

      data.tracks = [];
      app.display.setTitle('Loading followings...');
      app.api.SC.get('/users/' + app.profile.get('id') + '/followings', function(followings) {
        data.followings_loaded = 0;
        data.followings = followings;
        data.followings.forEach(function(following) {
          app.api.SC.get('/users/' + following.id + '/tracks', function(tracks) {
            app.display.setSubTitle((data.followings_loaded + 1) + ' / ' + (data.followings.length + 1));
            tracks.forEach(function(track) {
              data.tracks.push(new app.Track(track));
            });
            data.followings_loaded = data.followings_loaded + 1;
          });
        });

        watch(data, 'followings_loaded', function() {
          if (data.followings_loaded === data.followings.length) {
            app.display.setTitle('Loading tracks...');
            data.tracks = utils.shuffle(data.tracks);
            data.tracks.forEach(function(track) {
              app.display.setSubTitle((data.loaded + 1) + ' / ' + (data.tracks.length + 1));
              app.playlist.addTrack(track);
              data.loaded = data.loaded + 1;
            });
          }
        });
      });

      watch(data, 'loaded', watcher);
    }

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

          loadPlaylist();
        });
      });
    });

})(window);
