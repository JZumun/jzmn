import { arrify, flatten, clone, equals } from "./_utils";

//Function to add behavior to wrapper instance.
const extendFn = function(wrapper,methods,opts) {
	const extender = wrapper.extendFn;
	const { input:inputType, output:outputType } = clone(extender.defaults,opts);

	Object.keys(methods).forEach( methodName => {

		const method = methods[methodName];
		const calcValue = isFunction(inputType) ? inputType : extender.inputParser[inputType] || extender.inputParser[extender.defaults.inputType];
		const wrapValue = isFunction(outputType) ? outputType : extender.outputParser[outputType] || extender.outputParser[extender.defaults.outputType];

		wrapper.fn[methodName] = function(...args) {
			const inputValue = arrify(this.value);
			let outputValue = calcValue( method, inputValue, args );
			return wrapValue( wrapper, outputValue, this );
		}
	});


}
extendFn.defaults = {
	input: "individual",
	output: "wrapped"
};
extendFn.inputParser = {
	"array": 		(method,input,args) => flatten( method.call(null, input, ...args) || input),
	"single": 		(method,input,args) => flatten( method.call(null, input[0], ...args) || input[0]),
	"individual": 	(method,input,args) => flatten( input.map( el => method.call(null, el, ...args) || el) )
};
extendFn.outputParser = {
	"wrapped": 		(wrapper,output,context) => wrapper(output || context.value),
	"bare": 		(wrapper,output,context) => output.length > 1 ? output : output[0],
	"self": 		(wrapper,output,context) => wrapper(context.value),
	"bare || self": (wrapper,output,context) => output.every(equals(undefined)) ? wrapper(context.value) : output.length > 1 ? output : output[0]
};

//Function to add behavior to wrapper instance and attach methods to wrapper object;
const extendWrapper = function(wrapper,name,methods,opts) {
	const curr = (name) ? wrapper[name] || (wrapper[name] = {})
						: wrapper;

	Object.assign(curr,methods);
	wrapper.extendFn(methods,opts);
}

//Function to attach the original extension functions on the wrapper itself.
const initializeExtenders = (wrapper,oldVersion) => {
	const extender = extendFn.bind(null,wrapper);

	const oldExtender = (oldVersion && oldVersion.extendFn) || extendFn;
	extender.defaults = clone(oldExtender.defaults);
	extender.inputParser = clone(oldExtender.inputParser);
	extender.outputParser = clone(oldExtender.outputParser);

	wrapper.extendFn = extender;
	wrapper.extendWrapper = extendWrapper.bind(null,wrapper);
}

export default initializeExtenders;