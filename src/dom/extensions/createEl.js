const idMatcher = /#(-?[_a-zA-Z]+[_a-zA-Z0-9-]*)/,
	  classMatcher = /\.-?[_a-zA-Z]+[_a-zA-Z0-9-]*/g,
	  tagMatcher = /[^.#][a-zA-Z]*/;

export const appendChildren = (element,child) => {
	if (!child) return;
	if (child.nodeType) 					{ element.appendChild(child); }
	else if (child === child.toString()) 	{ element.innerHTML += child; }
	else if (child.length) 					{ Array.prototype.forEach.call(child,appendChildren.bind(null,element)); } 
}

export const replaceChildren = (element,child) => {
	element.innerHTML = "";
	appendChildren(element,child);
}

export const createEl = (tag,attributes,children) => {
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