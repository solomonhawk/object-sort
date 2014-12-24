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

	eval("'use strict';\n\nvar invariant = __webpack_require__(2);\nvar util      = __webpack_require__(1);\n\nvar Sort = {\n  types: {\n    order: {\n      ascending  : 'ascending',\n      descending : 'descending'\n    },\n    sort: {}\n  },\n\n  methods: {\n    groups: {},\n    order: {\n      ascending:function(a) { return a; },\n      descending:function(a) { return a.reverse(); }\n    },\n    sort: {}\n  },\n\n  factory:function(list) {\n    return Object.create(Sort, {\n      originalList : util.defaultObjectProp(list),\n      lastValue    : util.defaultObjectProp(list)\n    });\n  },\n\n  configure:function(types) {\n    invariant(\n      util.isObject(types),\n      'object-sort :: `configure` expects a type definition object, type was %s',\n      util.toStr(types)\n    );\n\n    Object.keys(types).map(function(key) {\n      invariant(\n        util.isFunction(types[key]) || util.isString(types[key]),\n        'object-sort :: `configure` expects the value of each type to be a string or function. It was: %s',\n        util.toStr(types[key])\n      );\n\n      if (util.isString(types[key])) {\n        types[key] = Sort._generateValueGetter(types, types[key]);\n      }\n\n      Sort.types.sort[key]     = key;\n      Sort.methods.sort[key]   = Sort._generateSortFn(types[key]);\n      Sort.methods.groups[key] = types[key];\n    }, this);\n  },\n\n  order:function(type) {\n    invariant(\n      util.objectKeysContain(this.types.order, type),\n      'object-sort :: invalid type passed to method `order`. %s',\n      type\n    );\n\n    if (!this.lastValue.length) { return; }\n\n    if (util.isArray(this.lastValue[0])) {\n      this.lastValue.forEach(function(val) {\n        this.methods.order[type](val);\n      }, this);\n    } else {\n      this.methods.order[type](this.lastValue);\n    }\n\n    return this;\n  },\n\n  sort:function(type) {\n    invariant(\n      util.objectKeysContain(this.types.sort, type),\n      'object-sort :: invalid type passed to method `sort`. %s',\n      type\n    );\n\n    if (!this.lastValue.length) { return; }\n\n    if (util.isArray(this.lastValue[0])) {\n      this.lastValue.forEach(function(val) {\n        val.sort(this.methods.sort[type]);\n      }, this);\n    } else {\n      this.lastValue.sort(this.methods.sort[type]);\n    }\n\n    return this;\n  },\n\n  group:function(type) {\n    invariant(\n      util.objectKeysContain(this.types.sort, type),\n      'object-sort :: invalid type passed to method `group`. %s',\n      type\n    );\n\n    if (!this.lastValue.length) { return; }\n\n    this.lastValue = this._partition(this.methods.groups[type]);\n    return this;\n  },\n\n  reset:function() {\n    this.lastValue = this.originalList;\n    return this;\n  },\n\n  getValue:function() {\n    var value = this.lastValue.slice(0);\n    return this.reset() && value;\n  },\n\n  getOriginalValue:function() {\n    return this.originalList;\n  },\n\n  _generateValueGetter:function(object, key) {\n    return function(object) {\n      return object[key];\n    };\n  },\n\n  _generateSortFn:function(getValue) {\n    return function(a, b) {\n      a = util.normalizeValue(getValue(a));\n      b = util.normalizeValue(getValue(b));\n\n      if ( util.isNumeric(a) && util.isNumeric(b) ) { return a - b; }\n\n      return a < b ? -1 : a > b ? 1 : 0;\n    };\n  },\n\n  _partition:function(getValue) {\n    var groups = {};\n    var result = [];\n\n    this.lastValue.map(function(o) {\n      var k = util.normalizeValue(getValue(o));\n      (Object.hasOwnProperty.call(groups, k) ? groups[k] : groups[k] = []).push(o);\n    }, this);\n\n    Object.keys(groups).map(function(key) {\n      result.push(groups[key]);\n    });\n\n    return result;\n  }\n};\n\nmodule.exports = Sort;\n\n\n/*****************\n ** WEBPACK FOOTER\n ** ./lib/index.js\n ** module id = 0\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./lib/index.js?");

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	eval("module.exports = {\n  defaultObjectProp:function(value) {\n    return {\n      value: value,\n      writable: true,\n      enumerable: true,\n      configurable: true\n    }\n  },\n\n  normalizeValue:function(val) {\n    if (this.isArray(val)) val.sort();\n    if (this.isArray(val) && val.length === 1) return val[0];\n\n    return val;\n  },\n\n  objectKeysContain:function(object, key) {\n    return Object.keys(object).indexOf(key) != -1;\n  },\n\n  isFunction:function(o) {\n    return (Object.prototype.toString.call(o) === '[object Function]');\n  },\n\n  isObject:function(o) {\n    return (Object.prototype.toString.call(o) === '[object Object]');\n  },\n\n  isNumeric:function(n) {\n    return !isNaN(parseFloat(n)) && isFinite(n);\n  },\n\n  isString:function(s) {\n    return (typeof s == 'string');\n  },\n\n  isArray:function(a) {\n    return (Object.prototype.toString.call(a) === '[object Array]');\n  },\n\n  toStr:function(o) {\n    return Object.prototype.toString.call(o);\n  }\n}\n\n\n/*****************\n ** WEBPACK FOOTER\n ** ./lib/util/index.js\n ** module id = 1\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./lib/util/index.js?");

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	eval("/**\n * BSD License\n *\n * For Flux software\n *\n * Copyright (c) 2014, Facebook, Inc. All rights reserved.\n *\n * Redistribution and use in source and binary forms, with or without modification,\n * are permitted provided that the following conditions are met:\n *\n *  * Redistributions of source code must retain the above copyright notice, this\n *    list of conditions and the following disclaimer.\n *\n *  * Redistributions in binary form must reproduce the above copyright notice,\n *    this list of conditions and the following disclaimer in the\n *    documentation and/or other materials provided with the distribution.\n *\n *  * Neither the name Facebook nor the names of its contributors may be used to\n *    endorse or promote products derived from this software without specific\n *    prior written permission.\n *\n * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS \"AS IS\" AND\n * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED\n * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE\n * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR\n * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES\n * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;\n * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON\n * ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT\n * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS\n * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.\n *\n */\n\n'use strict';\n\n/**\n * Use invariant() to assert state which your program assumes to be true.\n *\n * Provide sprintf-style format (only %s is supported) and arguments\n * to provide information about what broke and what you were\n * expecting.\n *\n * The invariant message will be stripped in production, but the invariant\n * will remain to ensure logic does not differ in production.\n */\n\nvar invariant = function(condition, format, a, b, c, d, e, f) {\n  // if (process.env.NODE_ENV !== 'production') {\n  //   if (format === undefined) {\n  //     throw new Error('invariant requires an error message argument');\n  //   }\n  // }\n\n  if (!condition) {\n    var error;\n    if (format === undefined) {\n      error = new Error(\n        'Minified exception occurred; use the non-minified dev environment ' +\n        'for the full error message and additional helpful warnings.'\n      );\n    } else {\n      var args = [a, b, c, d, e, f];\n      var argIndex = 0;\n      error = new Error(\n        'Invariant Violation: ' +\n        format.replace(/%s/g, function() { return args[argIndex++]; })\n      );\n    }\n\n    error.framesToPop = 1; // we don't care about invariant's own frame\n    throw error;\n  }\n};\n\nmodule.exports = invariant;\n\n\n/*****************\n ** WEBPACK FOOTER\n ** ./~/invariant/invariant.js\n ** module id = 2\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./~/invariant/invariant.js?");

/***/ }
/******/ ])
});
