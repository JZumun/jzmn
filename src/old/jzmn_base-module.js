import factory from "./jzmn_module"

var iterator = function (method) {
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

factory.extendFn({ at: function(list,n) {
	return list[n] || [];
}}, { input: "array" });
factory.extendFactory("util",{
	flatten: flatten,
	arrify: arrify,
	each: 	iterator("forEach"),
	map: 	iterator("map"),
	filter:	iterator("filter"),
	reduce: function(el,fn,def) {
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
},{
	input: "array"
});

export factory as default;