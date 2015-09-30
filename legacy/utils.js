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

  global.setSrc = function(selector, value) {
    var el = $('[data-src-var="'+selector+'"]');
    if (el.length > 0) {
      el.attr('src', value);
      el.removeClass('hidden');
      return true;
    }
    return false;
  };

  global.getSrc = function(selector) {
    var el = $('[data-src-var="'+selector+'"]');
    if (el.length > 0) {
      return el.attr('src');
    }
    return null;
  };

  global.setAttr = function(selector, attr, value) {
    var el = $('[data-' + attr + '="' + selector + '"]');
    if (el.length > 0) {
      switch (attr) {
        case 'width':
        case 'height':
          el[attr](value);
          break;
        case 'value':
          el.val(value);
          break;
        default:
          el.attr(attr, value);
          break;
      }
      el.removeClass('hidden');
      return true;
    }
    return false;
  };

})(window);