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
	
	__webpack_require__(/*! ./patch */ 1);
	
	var invariant = __webpack_require__(/*! invariant */ 3);
	var _         = __webpack_require__(/*! ./util */ 2);
	
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
	
	  configure:function(types) {
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
	
	  order:function(type) {
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
	
	  sort:function(type) {
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
	
	  group:function(type) {
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
	
	  ungroup:function() {
	    if (this.isGrouped) {
	      this.isGrouped = false;
	      this.lastValue = _.flatten(this.lastValue);
	    }
	
	    return this;
	  },
	
	  reset:function() {
	    this.lastValue = this.originalList;
	    return this;
	  },
	
	  tap:function(callback) {
	    invariant(
	      _.isFunction(callback),
	      'object-sort :: invalid callback passed to `tap`, expects a function. %s',
	      _.toStr(callback)
	    );
	
	    callback(this.lastValue);
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
	      a = _.normalizeValue(getValue(a));
	      b = _.normalizeValue(getValue(b));
	
	      if ( _.isNumeric(a) && _.isNumeric(b) ) { return a - b; }
	
	      return a < b ? -1 : a > b ? 1 : 0;
	    };
	  },
	
	  _partition:function(getValue) {
	    var groups = {};
	    var result = [];
	
	    this.lastValue.map(function(object) {
	      var group = _.normalizeValue(getValue(object));
	      (Object.hasOwnProperty.call(groups, group)
	        ? groups[group]
	        : groups[group] = []
	      ).push(object);
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
/*!**********************!*\
  !*** ./lib/patch.js ***!
  \**********************/
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(/*! ./shims/array.every */ 4);
	__webpack_require__(/*! ./shims/object.keys */ 5);


/***/ },
/* 2 */
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
	  },
	
	  flatten:function(arr) {
	    return arr.reduce(function(a, b) {
	      return a.concat(b);
	    });
	  }
	}
	
	module.exports = Util;


/***/ },
/* 3 */
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


/***/ },
/* 4 */
/*!**********************************!*\
  !*** ./lib/shims/array.every.js ***!
  \**********************************/
/***/ function(module, exports, __webpack_require__) {

	if (!Array.prototype.every) {
	  Array.prototype.every = function(callbackfn, thisArg) {
	    'use strict';
	    var T, k;
	
	    if (this == null) {
	      throw new TypeError('this is null or not defined');
	    }
	
	    // 1. Let O be the result of calling ToObject passing the this
	    //    value as the argument.
	    var O = Object(this);
	
	    // 2. Let lenValue be the result of calling the Get internal method
	    //    of O with the argument "length".
	    // 3. Let len be ToUint32(lenValue).
	    var len = O.length >>> 0;
	
	    // 4. If IsCallable(callbackfn) is false, throw a TypeError exception.
	    if (typeof callbackfn !== 'function') {
	      throw new TypeError();
	    }
	
	    // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
	    if (arguments.length > 1) {
	      T = thisArg;
	    }
	
	    // 6. Let k be 0.
	    k = 0;
	
	    // 7. Repeat, while k < len
	    while (k < len) {
	
	      var kValue;
	
	      // a. Let Pk be ToString(k).
	      //   This is implicit for LHS operands of the in operator
	      // b. Let kPresent be the result of calling the HasProperty internal
	      //    method of O with argument Pk.
	      //   This step can be combined with c
	      // c. If kPresent is true, then
	      if (k in O) {
	
	        // i. Let kValue be the result of calling the Get internal method
	        //    of O with argument Pk.
	        kValue = O[k];
	
	        // ii. Let testResult be the result of calling the Call internal method
	        //     of callbackfn with T as the this value and argument list
	        //     containing kValue, k, and O.
	        var testResult = callbackfn.call(T, kValue, k, O);
	
	        // iii. If ToBoolean(testResult) is false, return false.
	        if (!testResult) {
	          return false;
	        }
	      }
	      k++;
	    }
	    return true;
	  };
	}


/***/ },
/* 5 */
/*!**********************************!*\
  !*** ./lib/shims/object.keys.js ***!
  \**********************************/
/***/ function(module, exports, __webpack_require__) {

	// From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
	if (!Object.keys) {
	  Object.keys = (function() {
	    'use strict';
	    var hasOwnProperty = Object.prototype.hasOwnProperty,
	        hasDontEnumBug = !({ toString: null }).propertyIsEnumerable('toString'),
	        dontEnums = [
	          'toString',
	          'toLocaleString',
	          'valueOf',
	          'hasOwnProperty',
	          'isPrototypeOf',
	          'propertyIsEnumerable',
	          'constructor'
	        ],
	        dontEnumsLength = dontEnums.length;
	
	    return function(obj) {
	      if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
	        throw new TypeError('Object.keys called on non-object');
	      }
	
	      var result = [], prop, i;
	
	      for (prop in obj) {
	        if (hasOwnProperty.call(obj, prop)) {
	          result.push(prop);
	        }
	      }
	
	      if (hasDontEnumBug) {
	        for (i = 0; i < dontEnumsLength; i++) {
	          if (hasOwnProperty.call(obj, dontEnums[i])) {
	            result.push(dontEnums[i]);
	          }
	        }
	      }
	      return result;
	    };
	  }());
	}


/***/ }
/******/ ])
});

//# sourceMappingURL=object-sort.js.map