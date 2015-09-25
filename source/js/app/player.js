'use strict';

module.exports = function() {

  var player = {},
    Progress = require(__dirname + '/progress'),
    playbackControls = {
      previous: '[data-trigger="playback.previous"]',
      playPause: '[data-trigger="playback.playPause"]',
      next: '[data-trigger="playback.next"]',
      volume: '[data-trigger="playback.volume"]'
    },
    _tempVolume = 0;

  player.audio = null;
  player.controls = {};
  player.progress = null;

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

    player.progress = new Progress({
      el: $('[data-trigger="playback.progress"]'),
      value: 0,
      maxValue: 100,
      editable: true
    });
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

  player.mute = function() {
    _tempVolume = player.audio.volume;
    player.audio.volume = 0;
  };

  player.unmute = function() {
    player.audio.volume = _tempVolume;
    _tempVolume = 0;
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

    player.progress.setValue(0);

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

    player.on('load loadeddata', function() {
      player.progress.setMaxValue(player.audio.duration);
      player.progress.refresh();
    });

    player.on('timeupdate', function() {
      player.progress.setValue(player.audio.currentTime);
      player.progress.refresh();

      app.display.setSubTitle([
        player.displayTime(player.convertTime(player.audio.currentTime)),
        player.displayTime(player.convertTime(player.audio.duration))
      ].join(' / '));
    });
  };

  player.seekTo = function(time) {
    if (player.audio === null) {
      player.init();
    }

    if (time >= 0 && time <= player.audio.duration) {
      player.audio.currentTime = time;
    }
    return this;
  };

  return player;
};
