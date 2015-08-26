(function(global) {

  'use strict';

  if (typeof global.bridge === 'undefined') {
    throw new TypeError('Bridge is not defined!');
  }

  //bridge.setWindowTitle(value);
  //bridge.getWindowTitle();
  //bridge.setTitleVisibility(flag);
  //bridge.setWindowAppearance(flag);
  /*bridge.configureSearchInput({
    actionOnEndEditing: false,
    searchStringImmediately: false,
    wholeSearchString: false
  });*/
  //bridge.on('history-back', function(event) {});
  //bridge.on('history-forward', function(event) {});
  //bridge.on('search-input', function(event) {});

})(window);
