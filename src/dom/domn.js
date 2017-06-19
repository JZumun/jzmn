import { each, map, filter, reduce } from "../core/_iterators";
import { arr, arrify, flatten, isString, isArray } from "../core/_utils";
import jzmn from "../core/jzmn";

import { isNodeList, matchesQuery } from "./_utils";
import { hasClass, changeClass, toggleClass, removeClass, addClass } from "./extensions/classFn"
// import {on,off,delegate} from "./extensions/events"
import {appendChildren, replaceChildren, createEl} from "./extensions/createEl.js"

const domn = jzmn.branch({oldVersion: jzmn, parser: function(el) {
	return !el ? []
		: isArray(el) ? el
		: el.nodeType ? [el]
		: isNodeList(el) ? arr.slice.call(el)
		: isString(el) ? arr.slice.call( document.querySelectorAll(el) )
		: [el];
}});

domn.extendWrapper("dom",{
	find: (el,child) => arrify(el.querySelectorAll(child)),
	ancestor: (el,parent) => parent ? el.closest(parent) : el.parentNode,
	on: (el,event,callback) => el.addEventListener(event,callback)
}).extendWrapper("dom",{
	matches: matchesQuery,
	attr: (el,attr,value) => {
		if (value !== undefined) (value === null) ? el.removeAttribute(attr) : el.setAttribute(attr);
		else return el.getAttribute(attr);
	},
	html: (el, value) => {
		if (value !== undefined) el.innerHTML = value;
		else return el.innerHTML;
	}
}, { output: "bare || self" });


domn.extendWrapper("dom",{ hasClass }, { output: "bare" });
domn.extendWrapper("dom", {
	changeClass, toggleClass,
	removeClass, addClass
}, { input: "array"});

// domn.extendWrapper("dom",{ on,delegate,off });

domn.createEl = createEl;
domn.extendWrapper("dom",{appendChildren,replaceChildren});

domn.el = (string) => document.querySelector(string);
domn.els = (string) => document.querySelectorAll(string);

export default domn;
