'use strict';

var prop = Object.defineProperty,
  utils = require(__dirname + '/utils');

function Progress(options) {
  var _this = this;

  options = options || Object.create(null);

  var defaults = {
    el: null,
    value: 0,
    maxValue: 100,
    editable: true
  };

  prop(_this, '_el', {
    configurable: false,
    enumerable: true,
    writable: true,
    value: defaults.el
  });

  prop(_this, '_value', {
    configurable: false,
    enumerable: true,
    writable: true,
    value: defaults.value
  });

  prop(_this, '_maxValue', {
    configurable: false,
    enumerable: true,
    writable: true,
    value: defaults.maxValue
  });

  prop(_this, '_editable', {
    configurable: false,
    enumerable: true,
    writable: true,
    value: defaults.editable
  });

  prop(_this, '_editing', {
    configurable: false,
    enumerable: true,
    writable: true,
    value: false
  });

  function _getConfigValue(key) {
    return utils.hasProp(options, key) ? options[key] : defaults[key];
  }

  _this._el = _getConfigValue('el');
  if (_this._el) {
    _this._el = $(_this._el);
    _this._el.removeClass('hidden');
  } else {
    throw new Error('Invalid arguments');
  }

  _this.setValue(_getConfigValue('value'));
  _this.setMaxValue(_getConfigValue('maxValue'));
  _this.setEditable(_getConfigValue('editable'));

  _this._el.on('mousedown', function() {
    app.player.audio.pause();

    $(document).on('mousemove', function() {
      var offset = (_this._el.find('.seek-handle').offset().left - _this._el.offset().left);
      _this._el.data('value', offset);
//      _this._value = offset;
      _this.refresh();

      var time = (parseFloat(_this._value) * app.player.audio.duration) / 100;
      app.player.seekTo(time);
    });

    _this._el.on('mouseup', function() {
      _this._editing = false;
      $(document).off('mousemove');
      _this._el.off('mouseup');
      app.player.audio.play();
    });
  });

  _this._el.on('mouseup change', function() {
    _this._editing = false;
    app.player.audio.play();
  });

  _this._el.on('input', function($event) {
    _this._editing = true;
    var time = (parseFloat($(this).val()) * app.player.audio.duration) / 100;
    app.player.seekTo(time);
  });

  return _this;
};

Progress.prototype.setValue = function(value) {
  if (this._editing === false) {
    this._value = value;
  }
  return this;
};

Progress.prototype.getValue = function() {
  return this._value;
};

Progress.prototype.setMaxValue = function(value) {
  this._maxValue = value;
  return this;
}

Progress.prototype.getMaxValue = function() {
  return this._maxValue;
};

Progress.prototype.refresh = function() {
  var offset = ((this._value / this._maxValue) * 100) + '%';
  this._el.find('.progress-value').css('width', offset);
  //this._el.find('.seek-handle').css('transform', 'translateX(' + offset + ')');
};

Progress.prototype.setEditable = function(value) {
  this._editable = !(!value);
  if (this.isEditable() === false) {
    this._el.attr('disabled', true);
  } else {
    this._el.removeAttr('disabled');
  }
  return this;
};

Progress.prototype.isEditable = function() {
  return !(!this._editable);
};

module.exports = Progress;
