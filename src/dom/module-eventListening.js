/*
	Makes adding and removing event listeners easier
*/
(function(factory){
	"use strict"
	if (typeof factory === "undefined") {
		throw new TypeError("'jzmn' undefined. Unable to add methods for Event Listening");
	}

	factory.extendFactory("dom",{
		delegate: function(element,child,event,callback) {
			element.addEventListener(event,function(e){
				if (jzmn(e.target).matches(child)) { callback(e); }
			});
		}
	})
})(jzmn);