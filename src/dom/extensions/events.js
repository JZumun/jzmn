import { matchesQuery } from "../_utils"
const eventListeners = new WeakMap();
const getEventListeners = (element,event) => {
	let listeners = eventListeners.get(element);
	if (listeners) {
		return listeners[event] || (listeners[event] = new Set());
	} else {
		listeners = { [event]: new Set() };
		eventListeners.set(element,listeners);
		return listeners[event];
	}
}

export const on = (element,event,callback) => {
	element.addEventListener(event,callback);
	getEventListeners(element,event).add(callback);
}

export const delegate = (element,child,event,callback) => {
	on(element,event,(e)=>{
		if ( matchesQuery(e.target,child) ) { callback(e) }
	});
}

export const off = (element,event,callback) => {
	if (callback) {
		element.removeEventListener(event,callback);
		getEventListeners(element,event).delete(callback);
	} else {
		getEventListeners(element,event).forEach(cb=>off(element,event,cb))
	}
}