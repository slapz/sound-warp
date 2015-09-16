'use strict';

module.exports = function() {

  var player = {},
    playbackControls = {
      backward: '[data-trigger="playback.backward"]',
      playPause: '[data-trigger="playback.playPause"]',
      forward: '[data-trigger="playback.forward"]',
      volume: '[data-trigger="playback.volume"]'
    };

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

  player.load = function(src) {
    if (player.audio === null) {
      player.init();
    }

    player.audio.src = src;
    player.audio.load();
  };

  return player;
};
