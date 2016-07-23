/*
	Methods to work with DOM element classes.
	
	Added Factory + Instance Methods
		dom
		-	hasClass	: returns boolean if element has a class
		-	changeClass	: adds or removes class or array of classes depending on provided condition
		-	toggleClass : toggle class or array of classes
		-	addClass	: adds class
		-	removeClass : removes class
*/
(function(factory) {
	"use strict"
	if (typeof factory === "undefined") {
		throw new TypeError("'jzmn' undefined. Unable to add methods for working with DOM element classes.");
	}

	function changeClass(elems,cname,add) {
		var els = factory.util.parseEls(elems);
		if (Array.isArray(cname)) { factory.util.each(cname,function(cn){ changeClass(els,cn,add) }); return els; }

		/*Where the fun begins*/
		return els.map(function(el,i){
			var test = Object.prototype.toString.call(add) == '[object Function]' ? add(el,cname) : add; 
			if (!el.nodeType) throw new TypeError("Element is not a node");
			if (el.classList && cname.search(" ")<0) el.classList[test?"add":"remove"](cname);
			else if (el.className) el.className = test ?  el.className += " " + cname : el.className.replace(new RegExp('(^|\\b)' + cname.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
			return el;
		});
	}

	function hasClass(elems,cname){
		var el = factory.util.parseEls(elems)[0];
		if (!el) return false;

		if (!el.nodeType) throw new TypeError("Element is not a node");
		if (el.classList) return el.classList.contains(cname);
		else {
			return (el.className.search(cname) > -1);
		}
	};

	factory.extendFactory("dom",{
		hasClass: hasClass
	},{
		output: "bare"
	})
	factory.extendFactory("dom",{
		changeClass : changeClass,
		toggleClass : 	function (el,cname) { return changeClass(el,cname,function(x,c) { return !hasClass(x,c); })},
		removeClass : 	function (el,cname) { return changeClass(el,cname,false); },
		addClass : 		function (el,cname) { return changeClass(el,cname,true); },
	},{
		input: "array"
	});
})(jzmn);