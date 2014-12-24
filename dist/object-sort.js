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
/***/ function(module, exports, __webpack_require__) {

	eval("'use strict';\n\n__webpack_require__(1);\n\nvar invariant = __webpack_require__(3);\nvar util      = __webpack_require__(2);\n\nvar Sort = {\n\n  types: {\n    order: {\n      ascending  : 'ascending',\n      descending : 'descending'\n    },\n    sort: {}\n  },\n\n  methods: {\n    groups: {},\n    order: {\n      ascending:function(a) { return a; },\n      descending:function(a) { return a.reverse(); }\n    },\n    sort: {}\n  },\n\n  factory:function(list) {\n    invariant(\n      (util.isArray(list) && list.length > 0 && (util.isArrayOfObjects(list) || list.every(util.isArrayOfObjects))),\n      'object-sort :: `factory` expects a list (array of objects) or a pre-grouped list (array of arrays of objects) but was called with %s. All arrays are expected to be of non-zero length.',\n      list\n    );\n\n    return Object.create(Sort, {\n      originalList : util.defaultObjectProp(list),\n      lastValue    : util.defaultObjectProp(list),\n      isGrouped    : util.defaultObjectProp(list.every(util.isArrayOfObjects))\n    });\n  },\n\n  configure:function(types) {\n    invariant(\n      util.isObject(types),\n      'object-sort :: `configure` expects a type definition object, type was %s',\n      util.toStr(types)\n    );\n\n    Object.keys(types).map(function(key) {\n      invariant(\n        util.isFunction(types[key]) || util.isString(types[key]),\n        'object-sort :: `configure` expects the value of each type to be a string or function. It was: %s',\n        util.toStr(types[key])\n      );\n\n      if (util.isString(types[key])) {\n        types[key] = Sort._generateValueGetter(types, types[key]);\n      }\n\n      Sort.types.sort[key]     = key;\n      Sort.methods.sort[key]   = Sort._generateSortFn(types[key]);\n      Sort.methods.groups[key] = types[key];\n    }, this);\n  },\n\n  order:function(type) {\n    invariant(\n      util.objectKeysContain(this.types.order, type),\n      'object-sort :: invalid type passed to method `order`. %s',\n      type\n    );\n\n    if (this.isGrouped) {\n      this.lastValue.forEach(function(val) {\n        this.methods.order[type](val);\n      }, this);\n    } else {\n      this.methods.order[type](this.lastValue);\n    }\n\n    return this;\n  },\n\n  sort:function(type) {\n    invariant(\n      util.objectKeysContain(this.types.sort, type),\n      'object-sort :: invalid type passed to method `sort`. %s',\n      type\n    );\n\n    if (this.isGrouped) {\n      this.lastValue.forEach(function(val) {\n        val.sort(this.methods.sort[type]);\n      }, this);\n    } else {\n      this.lastValue.sort(this.methods.sort[type]);\n    }\n\n    return this;\n  },\n\n  group:function(type) {\n    invariant(\n      util.objectKeysContain(this.types.sort, type),\n      'object-sort :: invalid type passed to method `group`. %s',\n      type\n    );\n\n    if (this.isGrouped) {\n      this.ungroup();\n    }\n\n    this.isGrouped = true;\n    this.lastValue = this._partition(this.methods.groups[type]);\n    return this;\n  },\n\n  ungroup:function() {\n    this.isGrouped = false;\n    this.lastValue = util.flatten(this.lastValue);\n    return this;\n  },\n\n  reset:function() {\n    this.lastValue = this.originalList;\n    return this;\n  },\n\n  tap:function(callback) {\n    invariant(\n      util.isFunction(callback),\n      'object-sort :: invalid callback passed to `tap`, expects a function. %s',\n      util.toStr(callback)\n    );\n\n    callback(this.lastValue);\n    return this;\n  },\n\n  getValue:function() {\n    var value = this.lastValue.slice(0);\n    return this.reset() && value;\n  },\n\n  getOriginalValue:function() {\n    return this.originalList;\n  },\n\n  _generateValueGetter:function(object, key) {\n    return function(object) {\n      return object[key];\n    };\n  },\n\n  _generateSortFn:function(getValue) {\n    return function(a, b) {\n      a = util.normalizeValue(getValue(a));\n      b = util.normalizeValue(getValue(b));\n\n      if ( util.isNumeric(a) && util.isNumeric(b) ) { return a - b; }\n\n      return a < b ? -1 : a > b ? 1 : 0;\n    };\n  },\n\n  _partition:function(getValue) {\n    var groups = {};\n    var result = [];\n\n    this.lastValue.map(function(o) {\n      var k = util.normalizeValue(getValue(o));\n      (Object.hasOwnProperty.call(groups, k) ? groups[k] : groups[k] = []).push(o);\n    }, this);\n\n    Object.keys(groups).map(function(key) {\n      result.push(groups[key]);\n    });\n\n    return result;\n  }\n};\n\nmodule.exports = Sort;\n\n\n/*****************\n ** WEBPACK FOOTER\n ** ./lib/index.js\n ** module id = 0\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./lib/index.js?");

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	eval("__webpack_require__(4);\n__webpack_require__(5);\n\n\n/*****************\n ** WEBPACK FOOTER\n ** ./lib/patch.js\n ** module id = 1\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./lib/patch.js?");

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	eval("'use strict';\n\nvar Util = {\n  defaultObjectProp:function(value) {\n    return {\n      value: value,\n      writable: true,\n      enumerable: true,\n      configurable: true\n    }\n  },\n\n  normalizeValue:function(val) {\n    if (Util.isArray(val)) val.sort();\n    if (Util.isArray(val) && val.length === 1) return val[0];\n\n    return val;\n  },\n\n  objectKeysContain:function(object, key) {\n    return Object.keys(object).indexOf(key) != -1;\n  },\n\n  // also checks for length > 0\n  isArrayOfObjects:function(list) {\n    return Util.isArray(list) && list.length && list.every(function(val) {\n      return Util.isObject(val);\n    });\n  },\n\n  isFunction:function(o) {\n    return (Object.prototype.toString.call(o) === '[object Function]');\n  },\n\n  isObject:function(o) {\n    return (Object.prototype.toString.call(o) === '[object Object]');\n  },\n\n  isNumeric:function(n) {\n    return !isNaN(parseFloat(n)) && isFinite(n);\n  },\n\n  isString:function(s) {\n    return (typeof s == 'string');\n  },\n\n  isArray:function(a) {\n    return (Object.prototype.toString.call(a) === '[object Array]');\n  },\n\n  toStr:function(o) {\n    return Object.prototype.toString.call(o);\n  },\n\n  flatten:function(arr) {\n    return arr.reduce(function(a, b) {\n      return a.concat(b);\n    });\n  }\n}\n\nmodule.exports = Util;\n\n\n/*****************\n ** WEBPACK FOOTER\n ** ./lib/util/index.js\n ** module id = 2\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./lib/util/index.js?");

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	eval("/**\n * BSD License\n *\n * For Flux software\n *\n * Copyright (c) 2014, Facebook, Inc. All rights reserved.\n *\n * Redistribution and use in source and binary forms, with or without modification,\n * are permitted provided that the following conditions are met:\n *\n *  * Redistributions of source code must retain the above copyright notice, this\n *    list of conditions and the following disclaimer.\n *\n *  * Redistributions in binary form must reproduce the above copyright notice,\n *    this list of conditions and the following disclaimer in the\n *    documentation and/or other materials provided with the distribution.\n *\n *  * Neither the name Facebook nor the names of its contributors may be used to\n *    endorse or promote products derived from this software without specific\n *    prior written permission.\n *\n * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS \"AS IS\" AND\n * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED\n * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE\n * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR\n * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES\n * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;\n * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON\n * ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT\n * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS\n * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.\n *\n */\n\n'use strict';\n\n/**\n * Use invariant() to assert state which your program assumes to be true.\n *\n * Provide sprintf-style format (only %s is supported) and arguments\n * to provide information about what broke and what you were\n * expecting.\n *\n * The invariant message will be stripped in production, but the invariant\n * will remain to ensure logic does not differ in production.\n */\n\nvar invariant = function(condition, format, a, b, c, d, e, f) {\n  // if (process.env.NODE_ENV !== 'production') {\n  //   if (format === undefined) {\n  //     throw new Error('invariant requires an error message argument');\n  //   }\n  // }\n\n  if (!condition) {\n    var error;\n    if (format === undefined) {\n      error = new Error(\n        'Minified exception occurred; use the non-minified dev environment ' +\n        'for the full error message and additional helpful warnings.'\n      );\n    } else {\n      var args = [a, b, c, d, e, f];\n      var argIndex = 0;\n      error = new Error(\n        'Invariant Violation: ' +\n        format.replace(/%s/g, function() { return args[argIndex++]; })\n      );\n    }\n\n    error.framesToPop = 1; // we don't care about invariant's own frame\n    throw error;\n  }\n};\n\nmodule.exports = invariant;\n\n\n/*****************\n ** WEBPACK FOOTER\n ** ./~/invariant/invariant.js\n ** module id = 3\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./~/invariant/invariant.js?");

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	eval("if (!Array.prototype.every) {\n  Array.prototype.every = function(callbackfn, thisArg) {\n    'use strict';\n    var T, k;\n\n    if (this == null) {\n      throw new TypeError('this is null or not defined');\n    }\n\n    // 1. Let O be the result of calling ToObject passing the this\n    //    value as the argument.\n    var O = Object(this);\n\n    // 2. Let lenValue be the result of calling the Get internal method\n    //    of O with the argument \"length\".\n    // 3. Let len be ToUint32(lenValue).\n    var len = O.length >>> 0;\n\n    // 4. If IsCallable(callbackfn) is false, throw a TypeError exception.\n    if (typeof callbackfn !== 'function') {\n      throw new TypeError();\n    }\n\n    // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.\n    if (arguments.length > 1) {\n      T = thisArg;\n    }\n\n    // 6. Let k be 0.\n    k = 0;\n\n    // 7. Repeat, while k < len\n    while (k < len) {\n\n      var kValue;\n\n      // a. Let Pk be ToString(k).\n      //   This is implicit for LHS operands of the in operator\n      // b. Let kPresent be the result of calling the HasProperty internal\n      //    method of O with argument Pk.\n      //   This step can be combined with c\n      // c. If kPresent is true, then\n      if (k in O) {\n\n        // i. Let kValue be the result of calling the Get internal method\n        //    of O with argument Pk.\n        kValue = O[k];\n\n        // ii. Let testResult be the result of calling the Call internal method\n        //     of callbackfn with T as the this value and argument list\n        //     containing kValue, k, and O.\n        var testResult = callbackfn.call(T, kValue, k, O);\n\n        // iii. If ToBoolean(testResult) is false, return false.\n        if (!testResult) {\n          return false;\n        }\n      }\n      k++;\n    }\n    return true;\n  };\n}\n\n\n/*****************\n ** WEBPACK FOOTER\n ** ./lib/shims/array.every.js\n ** module id = 4\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./lib/shims/array.every.js?");

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	eval("// From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys\nif (!Object.keys) {\n  Object.keys = (function() {\n    'use strict';\n    var hasOwnProperty = Object.prototype.hasOwnProperty,\n        hasDontEnumBug = !({ toString: null }).propertyIsEnumerable('toString'),\n        dontEnums = [\n          'toString',\n          'toLocaleString',\n          'valueOf',\n          'hasOwnProperty',\n          'isPrototypeOf',\n          'propertyIsEnumerable',\n          'constructor'\n        ],\n        dontEnumsLength = dontEnums.length;\n\n    return function(obj) {\n      if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {\n        throw new TypeError('Object.keys called on non-object');\n      }\n\n      var result = [], prop, i;\n\n      for (prop in obj) {\n        if (hasOwnProperty.call(obj, prop)) {\n          result.push(prop);\n        }\n      }\n\n      if (hasDontEnumBug) {\n        for (i = 0; i < dontEnumsLength; i++) {\n          if (hasOwnProperty.call(obj, dontEnums[i])) {\n            result.push(dontEnums[i]);\n          }\n        }\n      }\n      return result;\n    };\n  }());\n}\n\n\n/*****************\n ** WEBPACK FOOTER\n ** ./lib/shims/object.keys.js\n ** module id = 5\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./lib/shims/object.keys.js?");

/***/ }
/******/ ])
});
