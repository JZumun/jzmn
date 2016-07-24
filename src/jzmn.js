/*
	The barest of bones of jzmn utility.

	Added Factory Methods
		-	extendFn	 : adds methods to jzmn instances
		-	extendFactory: adds methods to both the factory object and all instances.
		-	parser		 : function that defines how inputs to the factory are parsed. Replace this for custom parsing.
	Added Factory+Instance Methods
		util
		-	flatten		: Flattens nested arrays
		- 	arrify 		: Takes input and wraps it in an array. Default factory.parser
		-	each		: Similar to [].each
		-	map			: Similar to []].map	
		- 	filter		: Similar to [].filter
		-	reduce		: Similar to [].reduce
*/
var jzmn = (function(old_jzmn){
	"use strict"
	if (typeof old_jzmn !== "undefined") {
		throw new TypeError("'jzmn' already defined.");
	}

	var arr = Array.prototype;	
	var arrify = function(el) {
		return (el === undefined || el === null) ? []
			: el.length ? arr.slice.call(el)
			: [el];
	};
	var flatten = function(el,ret) {
		var retArr = ret || [];
		arrify(el).forEach(function(el,i){
			if (Array.isArray(el)) { flatten(el,retArr); }
			else { retArr.push(el) }
		});
		return retArr;
	}

	var factory = function(obj,parser) {
		var j = Object.create(factory.fn);
		j.els = (typeof parser === "function") ? parser(obj) : parse(obj);
		j.el = j.els[0];
		return j;
	};

	factory.fn = {};

	var parse = null;
	var parsers = {};
	factory.setParser = function(name,fn) { 
		if (fn) { parsers[name] = fn; }
		parse = parsers[name];
	}
	factory.setParser("default",arrify);

	factory.extendFn = function(obj,opts) {
		var options = Object.assign({
			input: "individual",
			output: "wrapped"
		},opts);

		Object.keys(obj).forEach(function(method){
			factory.fn[method] = function() {
				var args = arguments;
				var output;
				switch(options.input) {
					case "array":
						output = flatten(obj[method].bind(null,this.els).apply(null,args));
						break;
					case "single":
						output = flatten(obj[method].bind(null,this.el).apply(null,args));
						break;
					case "individual":
					default:
						output = flatten(this.els.map(function(el){
							return obj[method].bind(null,el).apply(null,args);
						}));
				}
				return {
					"wrapped": factory(output || this.els),
					"bare": output.length > 1 ? output : output[0],
					"self": factory(this.els),
					"bare || self": (output.every(function(el){ return el === undefined; })) ? factory(this.els) : output.length > 1 ? output : output[0]
				}[options.output];
			}
		});

		return obj;
	}
	factory.extendFactory = function(name,obj,opts) {
		var curr = (name) 	? factory[name] || (factory[name] = {})
							: factory;
		Object.keys(factory.extendFn(obj,opts)).forEach(function(fn,i){
			curr[fn] = obj[fn];
		});
		return factory;
	}


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

	return factory;
})(jzmn);