/*
	Utility function for creating DOM elements. Can stand alone.

	USAGE:
	jzmn.createEl(tag, attributes, children);

	ARGUMENTS:
		tag				- String, of the form "tagName#id.class1.class2.class3", describing the element to be created;
		attributes 		- [OPTIONAL] Object, listing element attributes and the values they are to be set to. Example: { "data-something":5 }
		children		- [OPTIONAL] One of the following:
						  String which the innerHTML of the element is to be set to, OR
						  DOM Element, OR
						  Array of strings and/or DOM elements

	RETURNS:
		DOM element created;

*/
var jzmn = (function(factory){
	"use strict"

	factory = factory || {};

	var idMatcher = /#(-?[_a-zA-Z]+[_a-zA-Z0-9-]*)/,
		classMatcher = /\.-?[_a-zA-Z]+[_a-zA-Z0-9-]*/g,
		tagMatcher = /[^.#][a-zA-Z]*/;

	function appendChildren(element,child) {
		if (!child) return;
		if (child.nodeType) 					{ element.appendChild(child); }
		else if (child === child.toString()) 	{ element.innerHTML += child; }
		else if (child.length) 					{ Array.prototype.forEach.call(child,appendChildren.bind(null,element)); } 
	}

	factory.createEl = function(tag,attributes,children) {
		var tagElement = tag.match(tagMatcher)[0];
		var elID       = tag.match(idMatcher);
		var elClasses  = tag.match(classMatcher);

		var element = document.createElement(tagElement);
		if (elID) element.setAttribute("id",elID[1])
		if (elClasses) element.setAttribute("class",elClasses.join("").split(".").join(" "));
		if (attributes)	Object.keys(attributes).forEach(function(key,i){
			var attrVal = attributes[key] instanceof Array ? attributes[key].join(" ") : attributes[key];
			element.setAttribute(key,attrVal);
		});
		appendChildren(element,children);
		return element;
	};

	if (factory.extendFactory) {
		factory.extendFactory("dom",{
			appendChildren: appendChildren,
			replaceChildren: function(element,child) {
				element.innerHTML = "";
				appendChildren(element,child);
			}
		});
	}

	return factory;
})(jzmn);