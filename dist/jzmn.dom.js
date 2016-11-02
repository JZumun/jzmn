(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.jzmn = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

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

var isString = function isString(o) {
	return Object.prototype.toString.call(o) === '[object String]';
};

var isArray = function isArray(o) {
	return Array.isArray(o);
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

//Function to add behavior to wrapper instance.
var generateExtendFn = function generateExtendFn() {
	var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	var _ref$oldDefaults = _ref.oldDefaults;
	var oldDefaults = _ref$oldDefaults === undefined ? {
		input: "individual",
		output: "wrapped"
	} : _ref$oldDefaults;
	var _ref$oldInputParser = _ref.oldInputParser;
	var oldInputParser = _ref$oldInputParser === undefined ? {
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
	} : _ref$oldInputParser;
	var _ref$oldOutputParser = _ref.oldOutputParser;
	var oldOutputParser = _ref$oldOutputParser === undefined ? {
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
	} : _ref$oldOutputParser;

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

	extendFn.defaults = clone(oldDefaults);
	extendFn.inputParser = clone(oldInputParser);
	extendFn.outputParser = clone(oldOutputParser);
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
	var extender = generateExtendFn(oldExtender);

	wrapper.extendFn = extender;
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

var isNode = function isNode(n) {
	return n.nodeType;
};
var isNodeList = function isNodeList(n) {
	var s = Object.prototype.toString.call(n);
	return (typeof n === 'undefined' ? 'undefined' : _typeof(n)) === 'object' && /^\[object (HTMLCollection|NodeList|Object)\]$/.test(s) && (n.length == 0 || _typeof(n[0]) === 'object' && n[0].nodeType);
};

var matchesQuery = function matchesQuery(el, query) {
	var p = Element.prototype;
	var f = p.matches || p.webkitMatchesSelector || p.mozMatchesSelector || p.msMatchesSelector || function (s) {
		return [].indexOf.call(document.querySelectorAll(s), this) !== -1;
	};
	return f.call(element, query);
};

var changeClass = function changeClass(elems, cname, add) {
	var els = arrify(elems);

	if (isArray(cname)) {
		cname.forEach(function (cn) {
			return changeClass(els, cn, add);
		});
		return els;
	}

	els.forEach(function (el) {
		var test = isFunction(add) ? add(el, cname) : add;
		if (!isNode(el)) throw new TypeError("Element is not a node");
		if (el.classList && cname.search(" ") < 0) el.classList[test ? "add" : "remove"](cname);else el.className = test ? el.className += " " + cname : el.className.replace(new RegExp('(^|\\b)' + cname.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
	});

	return els;
};

var hasClass = function hasClass(elems, cname) {
	var el = arrify(elems)[0];
	if (!el) return false;
	if (!isNode(el)) throw new TypeError("Element is not a node");
	if (el.classList) return el.classList.contains(cname);else return el.className.search(cname) > -1;
};

var toggleClass = function toggleClass(elems, cname) {
	return changeClass(elems, cname, function (e, c) {
		return !hasClass(e, c);
	});
};
var removeClass = function removeClass(elems, cname) {
	return changeClass(elems, cname, false);
};
var addClass = function addClass(elems, cname) {
	return changeClass(elems, cname, true);
};

var idMatcher = /#(-?[_a-zA-Z]+[_a-zA-Z0-9-]*)/;
var classMatcher = /\.-?[_a-zA-Z]+[_a-zA-Z0-9-]*/g;
var tagMatcher = /[^.#][a-zA-Z]*/;
var appendChildren = function appendChildren(element, child) {
	if (!child) return;
	if (child.nodeType) {
		element.appendChild(child);
	} else if (child === child.toString()) {
		element.innerHTML += child;
	} else if (child.length) {
		Array.prototype.forEach.call(child, appendChildren.bind(null, element));
	}
};

var replaceChildren = function replaceChildren(element, child) {
	element.innerHTML = "";
	appendChildren(element, child);
};

var createEl = function createEl(tag, attributes, children) {
	var tagElement = tag.match(tagMatcher)[0];
	var elID = tag.match(idMatcher);
	var elClasses = tag.match(classMatcher);

	var element = document.createElement(tagElement);
	if (elID) element.setAttribute("id", elID[1]);
	if (elClasses) element.setAttribute("class", elClasses.join("").split(".").join(" "));
	if (attributes) Object.keys(attributes).forEach(function (key, i) {
		var attrVal = attributes[key] instanceof Array ? attributes[key].join(" ") : attributes[key];
		element.setAttribute(key, attrVal);
	});
	appendChildren(element, children);
	return element;
};

// import {on,off,delegate} from "./extensions/events"
var domn = jzmn.branch({ oldVersion: jzmn, parser: function parser(el) {
		return !el ? [] : isArray(el) ? el : el.nodeType ? [el] : isNodeList(el) ? arr.slice.call(el) : isString(el) ? arr.slice.call(document.querySelectorAll(el)) : [el];
	} });

domn.extendWrapper("dom", {
	find: function find(el, child) {
		return arrify(el.querySelectorAll(child));
	},
	ancestor: function ancestor(el, parent) {
		return parent ? element.closest(parent) : element.parentNode;
	},
	on: function on(el, event, callback) {
		return el.addEventListener(event, callback);
	}
});

domn.extendWrapper("dom", {
	matches: matchesQuery,
	attr: function attr(el, _attr, value) {
		if (value !== undefined) value === null ? el.removeAttribute(_attr) : el.setAttribute(_attr);else return el.getAttribute(_attr);
	},
	html: function html(el, value) {
		if (value !== undefined) el.innerHTML = value;else return el.innerHTML;
	}
}, { output: "bare || self" });

domn.extendWrapper("dom", { hasClass: hasClass }, { output: "bare" });
domn.extendWrapper("dom", {
	changeClass: changeClass, toggleClass: toggleClass,
	removeClass: removeClass, addClass: addClass
}, { input: "array" });

// domn.extendWrapper("dom",{ on,delegate,off });

domn.createEl = createEl;
domn.extendWrapper("dom", { appendChildren: appendChildren, replaceChildren: replaceChildren });

domn.el = function (string) {
	return document.querySelector(string);
};
domn.els = function (string) {
	return document.querySelectorAll(string);
};

module.exports = domn;

},{}]},{},[1])(1)
});