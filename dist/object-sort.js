(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define(factory);
	else if(typeof exports === 'object')
		exports["object-sort"] = factory();
	else
		root["object-sort"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/*!**********************!*\
  !*** ./lib/index.js ***!
  \**********************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var invariant = __webpack_require__(/*! invariant */ 2);
	var util      = __webpack_require__(/*! ./util */ 1);
	
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
	      ascending:function(a) { return a; },
	      descending:function(a) { return a.reverse(); }
	    },
	    sort: {}
	  },
	
	  factory:function(list) {
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
	
	  configure:function(types) {
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
	
	  order:function(type) {
	    invariant(
	      util.objectKeysContain(this.types.order, type),
	      'object-sort :: invalid type passed to method `order`. %s',
	      type
	    );
	
	    if (!this.lastValue.length) { return; }
	
	    if (util.isArray(this.lastValue[0])) {
	      this.lastValue.forEach(function(val) {
	        this.methods.order[type](val);
	      }, this);
	    } else {
	      this.methods.order[type](this.lastValue);
	    }
	
	    return this;
	  },
	
	  sort:function(type) {
	    invariant(
	      util.objectKeysContain(this.types.sort, type),
	      'object-sort :: invalid type passed to method `sort`. %s',
	      type
	    );
	
	    if (!this.lastValue.length) { return; }
	
	    if (util.isArray(this.lastValue[0])) {
	      this.lastValue.forEach(function(val) {
	        val.sort(this.methods.sort[type]);
	      }, this);
	    } else {
	      this.lastValue.sort(this.methods.sort[type]);
	    }
	
	    return this;
	  },
	
	  group:function(type) {
	    invariant(
	      util.objectKeysContain(this.types.sort, type),
	      'object-sort :: invalid type passed to method `group`. %s',
	      type
	    );
	
	    if (!this.lastValue.length) { return; }
	
	    this.lastValue = this._partition(this.methods.groups[type]);
	    return this;
	  },
	
	  reset:function() {
	    this.lastValue = this.originalList;
	    return this;
	  },
	
	  getValue:function() {
	    var value = this.lastValue.slice(0);
	    return this.reset() && value;
	  },
	
	  getOriginalValue:function() {
	    return this.originalList;
	  },
	
	  _generateValueGetter:function(object, key) {
	    return function(object) {
	      return object[key];
	    };
	  },
	
	  _generateSortFn:function(getValue) {
	    return function(a, b) {
	      a = util.normalizeValue(getValue(a));
	      b = util.normalizeValue(getValue(b));
	
	      if ( util.isNumeric(a) && util.isNumeric(b) ) { return a - b; }
	
	      return a < b ? -1 : a > b ? 1 : 0;
	    };
	  },
	
	  _partition:function(getValue) {
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


/***/ },
/* 1 */
/*!***************************!*\
  !*** ./lib/util/index.js ***!
  \***************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Util = {
	  defaultObjectProp:function(value) {
	    return {
	      value: value,
	      writable: true,
	      enumerable: true,
	      configurable: true
	    }
	  },
	
	  normalizeValue:function(val) {
	    if (Util.isArray(val)) val.sort();
	    if (Util.isArray(val) && val.length === 1) return val[0];
	
	    return val;
	  },
	
	  objectKeysContain:function(object, key) {
	    return Object.keys(object).indexOf(key) != -1;
	  },
	
	  // also checks for length > 0
	  isArrayOfObjects:function(list) {
	    return Util.isArray(list) && list.length && list.every(function(val) {
	      return Util.isObject(val);
	    });
	  },
	
	  isFunction:function(o) {
	    return (Object.prototype.toString.call(o) === '[object Function]');
	  },
	
	  isObject:function(o) {
	    return (Object.prototype.toString.call(o) === '[object Object]');
	  },
	
	  isNumeric:function(n) {
	    return !isNaN(parseFloat(n)) && isFinite(n);
	  },
	
	  isString:function(s) {
	    return (typeof s == 'string');
	  },
	
	  isArray:function(a) {
	    return (Object.prototype.toString.call(a) === '[object Array]');
	  },
	
	  toStr:function(o) {
	    return Object.prototype.toString.call(o);
	  }
	}
	
	module.exports = Util;


/***/ },
/* 2 */
/*!**********************************!*\
  !*** ./~/invariant/invariant.js ***!
  \**********************************/
/***/ function(module, exports, __webpack_require__) {

	/**
	 * BSD License
	 *
	 * For Flux software
	 *
	 * Copyright (c) 2014, Facebook, Inc. All rights reserved.
	 *
	 * Redistribution and use in source and binary forms, with or without modification,
	 * are permitted provided that the following conditions are met:
	 *
	 *  * Redistributions of source code must retain the above copyright notice, this
	 *    list of conditions and the following disclaimer.
	 *
	 *  * Redistributions in binary form must reproduce the above copyright notice,
	 *    this list of conditions and the following disclaimer in the
	 *    documentation and/or other materials provided with the distribution.
	 *
	 *  * Neither the name Facebook nor the names of its contributors may be used to
	 *    endorse or promote products derived from this software without specific
	 *    prior written permission.
	 *
	 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
	 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
	 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
	 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
	 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
	 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
	 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
	 * ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
	 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
	 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	 *
	 */
	
	'use strict';
	
	/**
	 * Use invariant() to assert state which your program assumes to be true.
	 *
	 * Provide sprintf-style format (only %s is supported) and arguments
	 * to provide information about what broke and what you were
	 * expecting.
	 *
	 * The invariant message will be stripped in production, but the invariant
	 * will remain to ensure logic does not differ in production.
	 */
	
	var invariant = function(condition, format, a, b, c, d, e, f) {
	  // if (process.env.NODE_ENV !== 'production') {
	  //   if (format === undefined) {
	  //     throw new Error('invariant requires an error message argument');
	  //   }
	  // }
	
	  if (!condition) {
	    var error;
	    if (format === undefined) {
	      error = new Error(
	        'Minified exception occurred; use the non-minified dev environment ' +
	        'for the full error message and additional helpful warnings.'
	      );
	    } else {
	      var args = [a, b, c, d, e, f];
	      var argIndex = 0;
	      error = new Error(
	        'Invariant Violation: ' +
	        format.replace(/%s/g, function() { return args[argIndex++]; })
	      );
	    }
	
	    error.framesToPop = 1; // we don't care about invariant's own frame
	    throw error;
	  }
	};
	
	module.exports = invariant;


/***/ }
/******/ ])
});

//# sourceMappingURL=object-sort.js.map