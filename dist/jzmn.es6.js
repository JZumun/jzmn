(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.jzmn = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var arr = Array.prototype;

var arrify = function arrify(el) {
	return el === undefined || el === null ? [] : typeof el !== 'function' && el.length !== undefined ? arr.slice.call(el) : [el];
};

var clone = function clone() {
	for (var _len = arguments.length, x = Array(_len), _key = 0; _key < _len; _key++) {
		x[_key] = arguments[_key];
	}

	return Object.assign.apply(Object, [{}].concat(x));
};

var flatten = function flatten(obj) {
	return arrify(obj).reduce(function (retArr, curr) {
		return Array.isArray(curr) ? retArr.concat(flatten(curr)) : retArr.concat([curr]);
	}, []);
};

var id = function id(x) {
	return x;
};

var equals = function equals(thing) {
	return function (x) {
		return x === thing;
	};
};
var isFunction = function isFunction(n) {
	return Object.prototype.toString.call(n) == '[object Function]';
};

//Function to add behavior to wrapper instance.
var generateExtendFn = function generateExtendFn() {
	var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	var _ref$defaults = _ref.defaults;
	var defaults = _ref$defaults === undefined ? {
		input: "individual",
		output: "wrapped"
	} : _ref$defaults;
	var _ref$inputParser = _ref.inputParser;
	var inputParser = _ref$inputParser === undefined ? {
		"array": function array(method, input, args) {
			return flatten(method.call.apply(method, [null, input].concat(_toConsumableArray(args))) || input);
		},
		"single": function single(method, input, args) {
			return flatten(method.call.apply(method, [null, input[0]].concat(_toConsumableArray(args))) || input[0]);
		},
		"individual": function individual(method, input, args) {
			return flatten(input.map(function (el) {
				return method.call.apply(method, [null, el].concat(_toConsumableArray(args))) || el;
			}));
		}
	} : _ref$inputParser;
	var _ref$outputParser = _ref.outputParser;
	var outputParser = _ref$outputParser === undefined ? {
		"wrapped": function wrapped(wrapper, output, context) {
			return wrapper(output || context.value);
		},
		"bare": function bare(wrapper, output, context) {
			return output.length > 1 ? output : output[0];
		},
		"self": function self(wrapper, output, context) {
			return wrapper(context.value);
		},
		"bare || self": function bareSelf(wrapper, output, context) {
			return output.every(equals(undefined)) ? wrapper(context.value) : output.length > 1 ? output : output[0];
		}
	} : _ref$outputParser;

	var extendFn = function extendFn(methods, opts) {
		var wrapper = this;
		var extender = wrapper.extendFn;

		var _clone = clone(extender.defaults, opts);

		var inputType = _clone.input;
		var outputType = _clone.output;


		Object.keys(methods).forEach(function (methodName) {

			var method = methods[methodName];
			var calcValue = isFunction(inputType) ? inputType : extender.inputParser[inputType] || extender.inputParser[extender.defaults.inputType];
			var wrapValue = isFunction(outputType) ? outputType : extender.outputParser[outputType] || extender.outputParser[extender.defaults.outputType];

			wrapper.fn[methodName] = function () {
				var inputValue = arrify(this.value);

				for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
					args[_key2] = arguments[_key2];
				}

				var outputValue = calcValue(method, inputValue, args);
				return wrapValue(this.__wrapper__, outputValue, this);
			};
		});

		return wrapper;
	};

	extendFn.defaults = clone(defaults);
	extendFn.inputParser = clone(inputParser);
	extendFn.outputParser = clone(outputParser);
	return extendFn;
};

//Function to add behavior to wrapper instance and attach methods to wrapper object;
var extendWrapper = function extendWrapper(name, methods, opts) {
	var wrapper = this;
	var curr = name ? wrapper[name] || (wrapper[name] = {}) : wrapper;

	Object.assign(curr, methods);
	wrapper.extendFn(methods, opts);
	return wrapper;
};

//Function to attach the original extension functions on the wrapper itself.
var initializeExtenders = function initializeExtenders(wrapper, oldVersion) {
	var oldExtender = oldVersion && oldVersion.extendFn;
	wrapper.extendFn = generateExtendFn(oldExtender);
	wrapper.extendWrapper = extendWrapper;
};

//Function to add basic properties to wrapper
var initializeWrapper = function initializeWrapper(wrapper, oldVersion) {
	Object.assign(wrapper, oldVersion);

	wrapper.branch = factory;
	wrapper.fn = clone(oldVersion.fn);
	wrapper.fn.__wrapper__ = wrapper;
	initializeExtenders(wrapper, oldVersion);
	return wrapper;
};

/* FACTORY FUNCTION */
var factory = function factory() {
	var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	var _ref2$parser = _ref2.parser;
	var parser = _ref2$parser === undefined ? id : _ref2$parser;
	var _ref2$oldVersion = _ref2.oldVersion;
	var oldVersion = _ref2$oldVersion === undefined ? this || {} : _ref2$oldVersion;

	var wrapper = function wrapper(value) {
		var parse = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : parser;

		var j = Object.create(wrapper.fn);
		j.value = parse(value);
		return j;
	};
	return initializeWrapper(wrapper, oldVersion);
};

var iterator = function iterator(method) {
	return function (obj, fn, context) {
		if (!fn) return;
		if (obj.length || obj.length === 0) {
			return arr[method].call(obj, fn, context);
		} else {
			var retVal = {};
			Object.keys(obj)[method](function (key, i) {
				var x = fn.call(context || obj, obj[key], key, obj);
				if (x) retVal[key] = x;
				return x;
			});
			return retVal;
		}
	};
};

var each = iterator("forEach");
var map = iterator("map");
var filter = iterator("filter");
var reduce = function reduce(el, fn, def) {
	if (el.length || el.length === 0) {
		return arr.reduce.call(el, fn, def);
	} else {
		return Object.keys(el).reduce(function (acc, key, i) {
			if (!i) {
				if (!def) return el[key];else acc = def;
			}
			return fn.call(el, acc, el[key], key);
		}, "");
	}
};

var jzmn = factory({ parser: arrify, oldVersion: self.jzmn });

jzmn.extendFn({ invoke: function invoke(el, methodName) {
		for (var _len3 = arguments.length, args = Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
			args[_key3 - 2] = arguments[_key3];
		}

		return el[methodName].apply(el, args);
	} }).extendFn({ at: function at(list, n) {
		return list[n];
	} }, { input: "array" }).extendFn({ prop: function prop(el, p) {
		return el[p];
	} }, { input: "individual", output: "bare" });

jzmn.extendWrapper("util", {
	flatten: flatten, arrify: arrify
}).extendWrapper("util", {
	each: each, map: map, filter: filter, reduce: reduce
}, { input: "array" });

module.exports = jzmn;

},{}]},{},[1])(1)
});