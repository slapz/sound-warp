'use strict';

var utils = require(__dirname + '/utils'),

Progress = function Progress(options) {
  Object.defineProperty(this, 'options', {
    'configurable': false,
    'enumerable': true,
    'writable': true,
    'value': Object.create(null)
  });

  Object.defineProperty(this, 'seeking', {
    'configurable': false,
    'enumerable': false,
    'writable': true,
    'value': false
  });

  this.setOptions(options);

  var preventDefault = function(jqEvent) {
    jqEvent.preventDefault();
  };

  this.options.progressBar.on('dragstart dragend drop', preventDefault);
  this.options.progressBar.on('click drag', function(jqEvent) {
    preventDefault(jqEvent);
    var percent = (((jqEvent.clientX - this.options.progressBar.offset().left) / this.options.progressBar.width()) * 100);
    this.options.value = (percent / this.options.maxValue) * 100;
    this.options.valueContainer.css('width', percent + '%');
    app.player.pause();
    app.player.seekTo(percent, true);
    app.player.play();
  }.bind(this));
};

Progress.prototype.getOptions = function() {
  return this.options;
};

Progress.prototype.setOptions = function(options) {
  var _this = this,
    defaults = {
      value: 0,
      minValue: 0,
      maxValue: 0,
      progressBar: null,
      valueContainer: null,
      seekHandle: null,
      callback: function(jqEvent) {
        if (jqEvent) {
          preventDefault(jqEvent);
          _this.options.value = $(jqEvent.target).offset().left - jqEvent.clientX;
        }
        _this.options.valueContainer.css('width', ((_this.options.value / _this.options.maxValue) * 100) + '%');
      }
    };

  options = utils.extendDefaults(defaults, options, function(key, target, properties) {
    return !(!properties[key]);
  }) || Object.create(null);

  this.options = options;
  return this;
};

Progress.prototype.disable = function(flag) {
  if (flag) {
    this.options.progressBar.attr('disabled', flag);
    return this;
  }
  this.options.progressBar.removeAttr('disabled');
  return this;
};

Progress.prototype.getValue = function() {
  return this.options.value;
};

Progress.prototype.setValue = function(value) {
  this.options.value = value;
  this.options.callback();
};

Progress.prototype.getMinValue = function() {
  return this.options.minValue;
};

Progress.prototype.setMinValue = function(value) {
  this.options.minValue = value;
  this.options.callback();
};

Progress.prototype.getMaxValue = function() {
  return this.options.maxValue;
};

Progress.prototype.setMaxValue = function(value) {
  this.options.maxValue = value;
  this.options.callback();
};

module.exports = Progress;
