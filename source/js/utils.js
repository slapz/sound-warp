(function(global) {

  'use strict';

  var ArrProto = Array.prototype,
    $ = global.$ || global.jQuery;

  /**
   * @param {object} value
   */
  global.getArgs = function(value) {
    return ArrProto.slice.call(value, 0);
  };

  global.setVar = function(selector, value) {
    var el = $('[data-var="'+selector+'"]');
    if (el.length > 0) {
      el.html(value);
      el.removeClass('hidden');
      return true;
    }
    return false;
  };

  global.getVar = function(selector) {
    var el = $('[data-var="'+selector+'"]');
    if (el.length > 0) {
      return el.html();
    }
    return null;
  };

})(window);
