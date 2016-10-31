import { arr } from "./_utils"
const iterator = function(method) {
	return function(obj,fn,context) {
		if (!fn) return;
		if (obj.length || obj.length === 0) { return arr[method].call(obj,fn,context); }
		else {
			var retVal = {};
			Object.keys(obj)[method](function(key,i){
				var x = fn.call(context||obj,obj[key],key,obj);
				if (x) retVal[key] = x;
				return x;
			});
			return retVal;
		}
	}
}

export const each = iterator("forEach");
export const map = iterator("map");
export const filter = iterator("filter");
export const reduce = function(el,fn,def) {
	if (el.length || el.length === 0) { return arr.reduce.call(el,fn,def); }
	else {
		return Object.keys(el).reduce(function(acc,key,i){
			if (!i) {
				if (!def) return el[key];
				else acc = def;
			}
			return fn.call(el,acc,el[key],key);
		},"");
	}
}

export default iterator;

