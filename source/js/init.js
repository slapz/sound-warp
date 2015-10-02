'use strict';

let SoundWarp = require(`classes/app`),
  config = require(`${__dirname}/js/config`),
  Viewport = require(`modules/viewport`),
  Client = require(`modules/client`),
  Profile = require(`modules/profile`),
  Display = require(`modules/display/display`),
  PlaylistView = require(`modules/display/playlist-view`),
  Player = require(`modules/player/player`),
  events = require(`modules/events`),
  event = null;

/* Construct the application */
global.sw = new SoundWarp();

/* Setup configuration options */
sw.setOptions(config);

/* Register modules */
sw.registerModules({
  'viewport': new Viewport(),
  'client': new Client(sw.getOption('client')),
  'profile': new Profile(),
  'display': new Display(),
  'player': new Player(),
  'view': new PlaylistView()
});

/* Attach Events */
Object.keys(events).forEach(function(key) {
  event = events[key];
  if (typeof event === 'object' && typeof event.register === 'function') {
    event.register();
  }
});
