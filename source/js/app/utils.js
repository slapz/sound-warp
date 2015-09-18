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

module.exports = utils;
