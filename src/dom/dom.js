/*
	Makes it easier to use jzmn for DOM stuff.

	Added Factory Methods:
		-	parser	: overrides default parser with one that runs strings through document.querySelectorAll
		-	el		: alias for document.querySelector
		-	els		: alias for document.querySelector
	Added Factory+Instance Methods:
		dom
		-	attr	: gets or sets element attributes
		-	find	: alias for querySelector
		-	ancestor: returns parent or ancestor matching query
		-	html	: gets or sets element innerHTML;
		-	on		: sets event listener

*/
(function(factory){
	"use strict"
	if (typeof factory === "undefined") {
		throw new TypeError("'jzmn' undefined. Unable to set jzmn.parser for DOM parsing");
	}

	var arr = Array.prototype;	
	var isNodeList = function(n) {
		var s = Object.prototype.toString.call(n);
		return typeof n === 'object'
			&&  /^\[object (HTMLCollection|NodeList|Object)\]$/.test(s) 
			&& (n.length == 0 || (typeof n[0] === 'object' && n[0].nodeType));
	};
	function isString(o) {
        return (Object.prototype.toString.call(o) === '[object String]');
    }


    factory.el = document.querySelector.bind(document);
    factory.els = document.querySelectorAll.bind(document);
	factory.parser = function(el) {
		return    !el ? []
				: Array.isArray(el) ? el
				: el.nodeType ? [el]
				: isNodeList(el) ? arr.slice.call(el)
				: isString(el) ? arr.slice.call(document.querySelectorAll(el))
				: [el];
	}

	factory.extendFactory("dom",{
		attr: function(element,attribute,value) {
			if (value !== undefined) return (value === null) ? element.removeAttribute(attribute) : element.setAttribute(attribute,value);			
			else return element.getAttribute(attribute);
		},
		find: function(element,child) { return Array.prototype.slice.apply(element.querySelectorAll(child)); },
		ancestor: function(element,parent) {
			if (!parent) return element.parentNode;
			else return element.closest(parent);
		},
		html: function(element,value) {
				if (value !== undefined) element.innerHTML = value;
				else return element.innerHTML;
			},
		on:   function(element,event,callback) { element.addEventListener(event,callback); }
	});

	factory.extendFn(	{ attr: factory.dom.attr },
						{ output: "bare" }  );
})(jzmn);