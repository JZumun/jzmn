export const arr = Array.prototype;

export const arrify = function arrify(el) {
	return (el === undefined || el === null) ? []
				: (typeof el !== 'function') && el.length !== undefined ? arr.slice.call(el)
				: [el];
}

export const clone = (...x)=>Object.assign.apply(Object,[{}].concat(x));

export const compose = function compose(...fxns) {
	return function(...args) {
		return fxns.reduce((arg,fxn,i)=>{
			return [fxn.apply(this,arg)];
		},args)[0];
	}
}

export const curry = function curry(fn) {
	return (function f1(...args) {
		return (args.length >= fn.length) 
			? fn.apply(this,args) 
			: (...args2) => f1.apply(this,args.concat(args2));
	}).bind(this);
}

export const flatten = function flatten(obj) {
	return arrify(obj)
		.reduce((retArr,curr) => 
					Array.isArray(curr) 
						? retArr.concat(flatten(curr))
						: retArr.concat([curr])
			, [] );
}

export const id = x=>x;

export const noop = ()=>{};

export const equals =   thing => x => x===thing;
export const unequals = thing => x => x!==thing;

export const isFunction = function(n) {
	return Object.prototype.toString.call(n) == '[object Function]'
}

export const isString = function(o) {
	return (Object.prototype.toString.call(o) === '[object String]');
}

export const isArray = function(o) {
	return Array.isArray(o);
}