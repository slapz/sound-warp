'use strict';

module.exports = function(gutil) {

  let ArrayProto = Array.prototype;

  global.log = function() {
    return gutil.log.apply(gutil.log, ArrayProto.slice.call(arguments));
  };

  global.colors = gutil.colors;

  global.beep = function() {
    log('🔈  Beep!');
    return gutil.beep.apply(gutil.beep);
  };
};
