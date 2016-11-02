import { id, clone } from "./_utils";
import  initializeExtenders from "./_extenders";

//Function to add basic properties to wrapper
const initializeWrapper = function(wrapper,oldVersion) {
	Object.assign(wrapper,oldVersion);

	wrapper.branch = factory;
	wrapper.fn = clone(oldVersion.fn);
	wrapper.fn.__wrapper__ = wrapper;
	initializeExtenders(wrapper,oldVersion);
	return wrapper;
}

/* FACTORY FUNCTION */
const factory = function({ parser = id, oldVersion = this||{} }={}) {
	const wrapper = (value, parse = parser) => {
		const j = Object.create(wrapper.fn);
		j.value = parse(value);
		return j;
	}
	return initializeWrapper(wrapper, oldVersion);
}

export default factory;