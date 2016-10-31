export const isNode = function(n) {
	return n.nodeType;
}
export const isNodeList = function(n) {
	const s = Object.prototype.toString.call(n);
	return typeof n === 'object'
		&&  /^\[object (HTMLCollection|NodeList|Object)\]$/.test(s) 
		&& (n.length == 0 || (typeof n[0] === 'object' && n[0].nodeType));
}

export const matchesQuery = function(el,query) {
	const p = Element.prototype;
	const f = p.matches || p.webkitMatchesSelector || p.mozMatchesSelector || p.msMatchesSelector || function(s) {
		return [].indexOf.call(document.querySelectorAll(s), this) !== -1;
	};
	return f.call(element,query);
}