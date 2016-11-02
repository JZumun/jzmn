import factory from "./factory";
import { each, map, filter, reduce } from "./_iterators";
import { arrify, flatten } from "./_utils";

const jzmn = factory({parser: arrify, oldVersion: self.jzmn});

jzmn.extendFn({ at: (list,n) => list[n]}, {input: "array"})
	.extendFn({ prop: (el,p) => el[p] },  {input: "individual", output:"bare"});

jzmn.extendWrapper("util",{
		flatten, arrify
  }).extendWrapper("util",{
		each, map, filter, reduce
	},{input: "array"});

export default jzmn;