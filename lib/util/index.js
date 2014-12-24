'use strict';

var Util = {
  defaultObjectProp(value) {
    return {
      value: value,
      writable: true,
      enumerable: true,
      configurable: true
    }
  },

  normalizeValue(val) {
    if (Util.isArray(val)) val.sort();
    if (Util.isArray(val) && val.length === 1) return val[0];

    return val;
  },

  objectKeysContain(object, key) {
    return Object.keys(object).indexOf(key) != -1;
  },

  // also checks for length > 0
  isArrayOfObjects(list) {
    return Util.isArray(list) && list.length && list.every(function(val) {
      return Util.isObject(val);
    });
  },

  isFunction(o) {
    return (Object.prototype.toString.call(o) === '[object Function]');
  },

  isObject(o) {
    return (Object.prototype.toString.call(o) === '[object Object]');
  },

  isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  },

  isString(s) {
    return (typeof s == 'string');
  },

  isArray(a) {
    return (Object.prototype.toString.call(a) === '[object Array]');
  },

  toStr(o) {
    return Object.prototype.toString.call(o);
  },

  flatten(arr) {
    return arr.reduce(function(a, b) {
      return a.concat(b);
    });
  }
}

module.exports = Util;
