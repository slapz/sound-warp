'use strict';

module.exports = function() {

  var player = {},
    playbackControls = {
      previous: '[data-trigger="playback.previous"]',
      playPause: '[data-trigger="playback.playPause"]',
      next: '[data-trigger="playback.next"]',
      volume: '[data-trigger="playback.volume"]',
      progress: '[data-trigger="playback.progress"]'
    };

  player.audio = null;
  player.controls = {};

  player.init = function() {
    Object.keys(playbackControls).forEach(function(key) {
      player.controls[key] = $(playbackControls[key]);
    });

    player.audio = new Audio();
    var $audio = $(player.audio);

    player.on = function() {
      return $audio.on.apply($audio, getArgs(arguments));
    };

    player.off = function() {
      return $audio.off.apply($audio, getArgs(arguments));
    };
  };

  player.play = function() {
    if (player.audio !== null) {
      if (player.audio.paused) {
        player.audio.play();
      } else {
        player.audio.pause();
      }
    }
  };

  player.isPlaying = function() {
    return player.audio && player.audio.paused === false;
  };

  player.pause = function() {
    player.audio.pause();
  };

  player.stop = function() {
    player.audio.pause();
    player.audio.currentTime = 0;
  };

  player.setVolume = function(value) {
    player.audio.volume = value;
  };

  player.getVolume = function() {
    return player.audio.volume;
  };

  player.convertTime = function(seconds) {
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
  };

  player.displayTime = function(timeObj) {
    var output = '';

    ['hours', 'minutes', 'seconds'].forEach(function(key) {
      if (timeObj.hasOwnProperty(key) === false) {
        throw new TypeError('Invalid arguments');
      }
    });

    if (timeObj.hours > 0) {
      output = timeObj.hours + ':';
    }
    output += timeObj.minutes + ':';
    output += timeObj.seconds;

    return output;
  };

  player.load = function(track) {
    if (player.audio === null) {
      player.init();
    }

    if (track.isStreamable()) {
      app.display.setTitle(track.getFullTitle());
      document.title = track.getFullTitle() + ' – SoundWarp';

      var trackSource = app.api.url(track.getStreamUrl(), app.api.URL_CLIENT);
      this.setSource(trackSource);

      app.display.setArtwork(track.getArtwork(app.Track.ARTWORK_47));
      return true;
    }

    app.display.setTitle('Track could not be loaded!');
    return false;
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
        duration = player.audio.duration,
        _currentTime = player.displayTime(player.convertTime(currentTime)),
        _duration = player.displayTime(player.convertTime(duration));

      app.display.setSubTitle(_currentTime + ' / ' + _duration);

      if (duration > 0) {
        player.controls.progress
          .find('.progress-bar')
          .css('width', ((currentTime / duration) * 100) + '%');
      }
    });
  };

  return player;
};
