'use strict';

module.exports = function() {

  var player = {},
    playbackControls = {
      backward: '[data-trigger="playback.backward"]',
      playPause: '[data-trigger="playback.playPause"]',
      forward: '[data-trigger="playback.forward"]',
      volume: '[data-trigger="playback.volume"]',
      progress: '[data-trigger="playback.progress"]'
    };

  function _convertTime(seconds) {
    var hour = 60 * 60;
    function _leadingZero(val) {
      if (val < 10) {
        val = '0' + val;
      }
      return val;
    }
    return {
      hours: _leadingZero(Math.floor(seconds / hour)),
      minutes: _leadingZero(Math.floor(seconds % hour / 60)),
      seconds: _leadingZero(Math.ceil(seconds % hour % 60))
    };
  }

  player.audio = null;
  player.controls = {};

  player.init = function() {
    Object.keys(playbackControls).forEach(function(key) {
      player.controls[key] = $(playbackControls[key]);
    });

    player.audio = new Audio();
    var $audio = $(player.audio);

    player.controls.playPause.on('click', function($event) {
      if ($event.isDefaultPrevented() === false) {
        $event.preventDefault();
      }

      if (player.audio !== null) {
        if (player.audio.paused) {
          player.audio.play();
        } else {
          player.audio.pause();
        }
      }
    });

    player.controls.volume.on('change', function($event) {
      $event.preventDefault();
      player.audio.volume = $(this).val();
    });

    player.on = function() {
      return $audio.on.apply($audio, getArgs(arguments));
    };

    player.off = function() {
      return $audio.off.apply($audio, getArgs(arguments));
    };
  };

  player.load = function(track) {
    if (player.audio === null) {
      player.init();
    }

    if (!track.streamable) {
      app.display.setTitle('Track could not be loaded!');
      return false;
    }

    var user = (track.user.full_name || track.user.username),
      title = (user + ' – ' || '') + track.title;
    app.display.setTitle(title);
    document.title = title + ' – SoundWarp';

    var trackSource = app.api.url(track.stream_url, app.api.URL_CLIENT);
    this.setSource(trackSource);

    app.display.setArtwork(track.artwork_url.replace('-large', '-badge'));
  };

  player.setSource = function(src) {
    if (player.audio === null) {
      player.init();
    }

    player.audio.src = src;
    player.audio.load();
    player.controls.progress.removeClass('hidden');

/* @TODO: Implement loading progress indicator
    player.on('progress', function() {
      var bufferedEnd = player.audio.buffered.end(player.audio.buffered.length - 1),
        duration = player.audio.duration,
        currentTime = player.audio.currentTime,
        bufferedProgress = (bufferedEnd / duration) * 100,
        playedProgress = (currentTime / duration) * 100;
      if (duration > 0 && (bufferedProgress - playedProgress) === 0) {
        player.controls.progress.addClass('progress-striped');
      } else {
        player.controls.progress.removeClass('progress-striped');
      }
    });
*/

    player.on('timeupdate', function() {
      var currentTime = player.audio.currentTime,
        _currentTime = _convertTime(currentTime),
        strCurrentTime = '',
        duration = player.audio.duration,
        _duration = _convertTime(duration),
        strDuration = '';

      if (_currentTime.hours > 0) {
        strCurrentTime = _currentTime.hours + ':';
      }
      strCurrentTime += _currentTime.minutes + ':';
      strCurrentTime += _currentTime.seconds;

      if (_duration.hours > 0) {
        strDuration = _duration.hours + ':';
      }
      strDuration += _duration.minutes + ':';
      strDuration += _duration.seconds;

      app.display.setSubTitle(strCurrentTime + ' / ' + strDuration);

      if (duration > 0) {
        player.controls.progress
          .find('.progress-bar')
          .css('width', ((currentTime / duration) * 100) + '%');
      }
    });
  };

  return player;
};
