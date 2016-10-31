import factory from "./factory";
import { each, map, filter, reduce } from "./_iterators";
import { arrify, flatten } from "./_utils";

const jzmn = factory({parser: arrify, oldVersion: self.jzmn});

jzmn.extendFn({ 
	at: (list,n) => list[n]
},{
	input: "array"
});
jzmn.extendFn({
	prop: (el,p) => el[p]
})
jzmn.extendWrapper("util",{
	flatten, arrify,
	each, map, filter, reduce
});

export default jzmn;