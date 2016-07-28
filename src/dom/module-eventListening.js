/*
	Makes adding and removing event listeners easier
*/
(function(factory){
	"use strict"
	if (typeof factory === "undefined") {
		throw new TypeError("'jzmn' undefined. Unable to add methods for Event Listening");
	}

	var eventListeners = new WeakMap();

	function getEventListeners(element,event) {
		var listeners = eventListeners.get(element);
		if (listeners) {
			return listeners[event] ? listeners[event] : listeners[event] = [];
		} else {
			listeners = {};
			listeners[event] = [];
			eventListeners.set(element,listeners);
			return listeners[event];
		}
	}

	var on = function(element,event,callback) {
		element.addEventListener(event,callback);
		getEventListeners(element,event).push(callback);
	}

	var delegate = function(element,child,event,callback){
		on(element,event,function(e){
			if (jzmn(e.target).matches(child)) { callback(e); }
		});
	}

	var off = function(element,event,callback) {
		if (callback) {
			element.removeEventListener(event,callback);
		} else getEventListeners(element,event).forEach(function(cb){
			element.removeEventListener(event,cb);
		});
	}

	factory.extendFactory("dom",{
		on: on,
		delegate: delegate,
		off: off
	})
})(jzmn);