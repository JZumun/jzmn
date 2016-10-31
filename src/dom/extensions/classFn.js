import {arrify} from "../../core/_utils"
import {isNode} from "../_utils"
import {isArray,isFunction} from "../../core/_utils"

export const changeClass = (elems,cname,add) => {
	const els = arrify(elems);

	if (isArray(cname)) { 
		cname.forEach(cn => changeClass(els,cn,add));
		return els;
	}

	els.forEach(el => {
		const test = isFunction(add) ? add(el,cname) : add;
		if (!isNode(el)) throw new TypeError("Element is not a node");
		if (el.classList && cname.search(" ")<0) el.classList[test?"add":"remove"](cname);
		else el.className = test ? el.className += " " + cname : el.className.replace(new RegExp('(^|\\b)' + cname.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
	});

	return els;
}

export const hasClass = (elems,cname) => {
	const el = arrify(elems)[0];
	if (!el) return false;
	if (!isNode(el)) throw new TypeError("Element is not a node");
	if (el.classList) return el.classList.contains(cname);
	else return el.className.search(cname) > -1;
}

export const toggleClass = (elems,cname) => changeClass(elems,cname,(e,c)=>!hasClass(e,c));
export const removeClass = (elems,cname) => changeClass(elems,cname,false);
export const addClass = (elems,cname) => changeClass(elems,cname,true);