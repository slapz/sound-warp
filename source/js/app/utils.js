'use strict';

var utils = Object.create(null),
  objectToString = Object.prototype.toString;

utils.isObject = function isObject(value) {
  return objectToString.call(value) === '[object Object]';
}

utils.isArray = function isArray(value) {
  return objectToString.call(value) === '[object Array]';
}

utils.isString = function isString(value) {
  return objectToString.call(value) === '[object String]';
}

utils.isEmpty = function isEmpty(value) {
  if (isObject(value)) {
    value = Object.keys(value);
  }
  return value.length > 0;
}

utils.isFunction = function isFunction(value) {
  return objectToString.call(value) === '[object Function]';
};

utils.hasProp = function hasProp(obj, prop) {
  return obj.hasOwnProperty(prop);
};

utils.extend = function extend(target, properties) {
  if (!utils.isObject(target) || !utils.isObject(properties)) {
    throw new TypeError('Invalid arguments');
  }
  Object.keys(properties).forEach(function(key) {
    target[key] = properties[key];
  });
  return target;
};

utils.extendDefaults = function extend(target, properties, cb) {
  if (!utils.isObject(target) || !utils.isObject(properties) || !utils.isFunction(cb)) {
    throw new TypeError('Invalid arguments');
  }
  Object.keys(properties).forEach(function(key) {
    if (cb(key, target, properties) === true) {
      target[key] = properties[key];
    }
  });
  return target;
};

utils.shuffle = function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};

module.exports = utils;
