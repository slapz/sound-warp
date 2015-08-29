(function(global) {

  'use strict';

  var ArrProto = Array.prototype;

  /**
   * @param {object} value
   */
  global.args = function(value) {
    return ArrProto.slice.call(value, 0);
  };

})(window);
