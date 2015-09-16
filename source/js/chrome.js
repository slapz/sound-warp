(function(global) {

  'use strict';

  if (typeof global.chrome == 'undefined') {
    return false;
  }

  /* Set the default title */
  global.chrome.setTitle(document.title);

  /* Handle window.title changes */
  watch(document, 'title', function() {
    global.chrome.setTitle(document.title);
  });

})(window);
