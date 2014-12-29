'use strict';

require('./patch');

var invariant = require('invariant');
var _         = require('./util');

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
      (_.isArray(list) && list.length > 0 && (_.isArrayOfObjects(list) || list.every(_.isArrayOfObjects))),
      'object-sort :: `factory` expects a list (array of objects) or a pre-grouped list (array of arrays of objects) but was called with %s. All arrays are expected to be of non-zero length.',
      list
    );

    return Object.create(Sort, {
      originalList : _.defaultObjectProp(list),
      lastValue    : _.defaultObjectProp(list),
      isGrouped    : _.defaultObjectProp(list.every(_.isArrayOfObjects))
    });
  },

  configure(types) {
    invariant(
      _.isObject(types),
      'object-sort :: `configure` expects a type definition object, type was %s',
      _.toStr(types)
    );

    Object.keys(types).map(function(key) {
      invariant(
        _.isFunction(types[key]) || _.isString(types[key]),
        'object-sort :: `configure` expects the value of each property in the types object to be a string or function. It was: %s',
        _.toStr(types[key])
      );

      if (_.isString(types[key])) {
        types[key] = Sort._generateValueGetter(types, types[key]);
      }

      Sort.types.sort[key]     = key;
      Sort.methods.sort[key]   = Sort._generateSortFn(types[key]);
      Sort.methods.groups[key] = types[key];
    }, this);
  },

  order(type) {
    invariant(
      _.objectKeysContain(this.types.order, type),
      'object-sort :: invalid type passed to method `order`. %s',
      type
    );

    if (this.isGrouped) {
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
      _.objectKeysContain(this.types.sort, type),
      'object-sort :: invalid type passed to method `sort`. %s',
      type
    );

    if (this.isGrouped) {
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
      _.objectKeysContain(this.types.sort, type),
      'object-sort :: invalid type passed to method `group`. %s',
      type
    );

    if (this.isGrouped) {
      this.ungroup();
    }

    this.isGrouped = true;
    this.lastValue = this._partition(this.methods.groups[type]);

    return this;
  },

  ungroup() {
    if (this.isGrouped) {
      this.isGrouped = false;
      this.lastValue = _.flatten(this.lastValue);
    }

    return this;
  },

  reset() {
    this.lastValue = this.originalList;
    return this;
  },

  tap(callback) {
    invariant(
      _.isFunction(callback),
      'object-sort :: invalid callback passed to `tap`, expects a function. %s',
      _.toStr(callback)
    );

    callback(this.lastValue);
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
      a = _.normalizeValue(getValue(a));
      b = _.normalizeValue(getValue(b));

      if ( _.isNumeric(a) && _.isNumeric(b) ) { return a - b; }

      return a < b ? -1 : a > b ? 1 : 0;
    };
  },

  _partition(getValue) {
    var groups = {};
    var result = [];

    this.lastValue.map(function(object) {
      var group = _.normalizeValue(getValue(object));
      (Object.hasOwnProperty.call(groups, group) ? groups[group] : groups[group] = []).push(object);
    }, this);

    Object.keys(groups).map(function(key) {
      result.push(groups[key]);
    });

    return result;
  }
};

module.exports = Sort;
