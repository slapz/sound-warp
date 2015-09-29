'use strict';

let SoundWarp = require(`classes/app`),
  config = require(`${__dirname}/js/config`),
  Viewport = require(`modules/viewport`),
  Client = require(`modules/client`),
  Profile = require(`modules/profile`),
  Display = require(`modules/display`),
  Player = require(`modules/player/player`);

global.sw = new SoundWarp();
sw.setOptions(config);

sw.defineModules({
  'viewport': new Viewport(),
  'client': new Client(),
  'profile': new Profile(),
  'display': new Display(),
  'player': new Player()
});

/**
 * @TODO Progress indicator must be part of `Display`
 * @TODO Map controls and events
*/
