(function(global) {

  'use strict';

  var ArrProto = Array.prototype;

  /**
   * @param {object} value
   */
  global.args = function(value) {
    return ArrProto.slice.call(value, 0);
  };

  /* Handle window.title changes */
  chrome.setTitle(document.title);
  watch(document, 'title', function() {
    chrome.setTitle(document.title);
  });

})(window);
