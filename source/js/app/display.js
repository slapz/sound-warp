'use strict';

module.exports = function() {

  function Display() {
    this.reset();
  }

  Display.prototype.reset = function() {
    this.resetTitle();
    this.resetSubTitle();
    return this;
  };

  Display.prototype.setTitle = function(value) {
    setVar('display.main-row', value);
    return this;
  };

  Display.prototype.resetTitle = function() {
    this.setTitle('');
    return this;
  };

  Display.prototype.setSubTitle = function(value) {
    setVar('display.sub-row', value);
    return this;
  };

  Display.prototype.resetSubTitle = function() {
    this.setSubTitle('');
    return this;
  };

  Display.prototype.display = function(title, subTitle) {
    this.setTitle(title);
    this.setSubTitle(subTitle);
    return this;
  };

  Display.prototype.setArtwork = function(url) {
    setSrc('display.artwork', url);
    return this;
  };

  return new Display();
};
