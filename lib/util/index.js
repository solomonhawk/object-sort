module.exports = {
  defaultObjectProp: function(value) {
    return {
      value: value,
      writable: true,
      enumerable: true,
      configurable: true
    }
  },

  normalizeValue: function(val) {
    if (this.isArray(val)) val.sort();
    if (this.isArray(val) && val.length === 1) return val[0];

    return val;
  },

  objectKeysContain: function(object, key) {
    return Object.keys(object).indexOf(key) != -1;
  },

  isFunction: function(o) {
    return (Object.prototype.toString.call(o) === '[object Function]');
  },

  isObject: function(o) {
    return (Object.prototype.toString.call(o) === '[object Object]');
  },

  isNumeric: function(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  },

  isString: function(s) {
    return (typeof s == 'string');
  },

  isArray: function(a) {
    return (Object.prototype.toString.call(a) === '[object Array]');
  },

  toStr: function(o) {
    return Object.prototype.toString.call(o);
  }
}
