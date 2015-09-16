(function(global) {

  'use strict';

  var ArrProto = Array.prototype;

  /**
   * @param {object} value
   */
  global.getArgs = function(value) {
    return ArrProto.slice.call(value, 0);
  };

})(window);
