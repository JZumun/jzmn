import { arrify, flatten, clone, equals, isFunction } from "./_utils";

//Function to add behavior to wrapper instance.
const generateExtendFn = ({
		oldDefaults = {
			input: "individual",
			output: "wrapped"
		}, 
		oldInputParser = {
			"array": 		(method,input,args) => flatten( method.call(null, input, ...args) || input),
			"single": 		(method,input,args) => flatten( method.call(null, input[0], ...args) || input[0]),
			"individual": 	(method,input,args) => flatten( input.map( el => method.call(null, el, ...args) || el) )
		}, 
		oldOutputParser = {
			"wrapped": 		(wrapper,output,context) => wrapper(output || context.value),
			"bare": 		(wrapper,output,context) => output.length > 1 ? output : output[0],
			"self": 		(wrapper,output,context) => wrapper(context.value),
			"bare || self": (wrapper,output,context) => output.every(equals(undefined)) ? wrapper(context.value) : output.length > 1 ? output : output[0]
		}
} = {}) => {
	const extendFn = function(methods,opts) {
		const wrapper = this;
		const extender = wrapper.extendFn;
		const { input:inputType, output:outputType } = clone(extender.defaults,opts);

		Object.keys(methods).forEach( methodName => {

			const method = methods[methodName];
			const calcValue = isFunction(inputType) ? inputType : extender.inputParser[inputType] || extender.inputParser[extender.defaults.inputType];
			const wrapValue = isFunction(outputType) ? outputType : extender.outputParser[outputType] || extender.outputParser[extender.defaults.outputType];

			wrapper.fn[methodName] = function(...args) {
				const inputValue = arrify(this.value);
				let outputValue = calcValue( method, inputValue, args );
				return wrapValue( this.__wrapper__, outputValue, this );
			}
		});

		return wrapper;
	}

	extendFn.defaults = clone(oldDefaults);
	extendFn.inputParser = clone(oldInputParser);
	extendFn.outputParser = clone(oldOutputParser);
	return extendFn;
};


//Function to add behavior to wrapper instance and attach methods to wrapper object;
const extendWrapper = function(name,methods,opts) {
	const wrapper = this;
	const curr = (name) ? wrapper[name] || (wrapper[name] = {})
						: wrapper;

	Object.assign(curr,methods);
	wrapper.extendFn(methods,opts);
	return wrapper;
}

//Function to attach the original extension functions on the wrapper itself.
const initializeExtenders = (wrapper,oldVersion) => {
	const oldExtender = (oldVersion && oldVersion.extendFn);
	const extender = generateExtendFn(oldExtender);

	wrapper.extendFn = extender;
	wrapper.extendWrapper = extendWrapper;
}

export default initializeExtenders;