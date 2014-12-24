'use strict';

var invariant = require('invariant');
var util      = require('./util');

var Sort = {

  types: {
    order: {
      ascending  : 'ascending',
      descending : 'descending'
    },
    sort: {}
  },

  methods: {
    groups: {},
    order: {
      ascending(a) { return a; },
      descending(a) { return a.reverse(); }
    },
    sort: {}
  },

  factory(list) {
    invariant(
      util.isArrayOfObjects(list) || list.every(util.isArrayOfObjects),
      'object-sort :: `factory` expects a list (non-empty array of objects) or a pre-grouped list (array of arrays of objects) but was called with %s',
      list
    );
    return Object.create(Sort, {
      originalList : util.defaultObjectProp(list),
      lastValue    : util.defaultObjectProp(list)
    });
  },

  configure(types) {
    invariant(
      util.isObject(types),
      'object-sort :: `configure` expects a type definition object, type was %s',
      util.toStr(types)
    );

    Object.keys(types).map(function(key) {
      invariant(
        util.isFunction(types[key]) || util.isString(types[key]),
        'object-sort :: `configure` expects the value of each type to be a string or function. It was: %s',
        util.toStr(types[key])
      );

      if (util.isString(types[key])) {
        types[key] = Sort._generateValueGetter(types, types[key]);
      }

      Sort.types.sort[key]     = key;
      Sort.methods.sort[key]   = Sort._generateSortFn(types[key]);
      Sort.methods.groups[key] = types[key];
    }, this);
  },

  order(type) {
    invariant(
      util.objectKeysContain(this.types.order, type),
      'object-sort :: invalid type passed to method `order`. %s',
      type
    );

    if (util.isArray(this.lastValue[0])) {
      this.lastValue.forEach(function(val) {
        this.methods.order[type](val);
      }, this);
    } else {
      this.methods.order[type](this.lastValue);
    }

    return this;
  },

  sort(type) {
    invariant(
      util.objectKeysContain(this.types.sort, type),
      'object-sort :: invalid type passed to method `sort`. %s',
      type
    );

    if (util.isArray(this.lastValue[0])) {
      this.lastValue.forEach(function(val) {
        val.sort(this.methods.sort[type]);
      }, this);
    } else {
      this.lastValue.sort(this.methods.sort[type]);
    }

    return this;
  },

  group(type) {
    invariant(
      util.objectKeysContain(this.types.sort, type),
      'object-sort :: invalid type passed to method `group`. %s',
      type
    );

    this.lastValue = this._partition(this.methods.groups[type]);
    return this;
  },

  reset() {
    this.lastValue = this.originalList;
    return this;
  },

  getValue() {
    var value = this.lastValue.slice(0);
    return this.reset() && value;
  },

  getOriginalValue() {
    return this.originalList;
  },

  _generateValueGetter(object, key) {
    return function(object) {
      return object[key];
    };
  },

  _generateSortFn(getValue) {
    return function(a, b) {
      a = util.normalizeValue(getValue(a));
      b = util.normalizeValue(getValue(b));

      if ( util.isNumeric(a) && util.isNumeric(b) ) { return a - b; }

      return a < b ? -1 : a > b ? 1 : 0;
    };
  },

  _partition(getValue) {
    var groups = {};
    var result = [];

    this.lastValue.map(function(o) {
      var k = util.normalizeValue(getValue(o));
      (Object.hasOwnProperty.call(groups, k) ? groups[k] : groups[k] = []).push(o);
    }, this);

    Object.keys(groups).map(function(key) {
      result.push(groups[key]);
    });

    return result;
  }
};

module.exports = Sort;
