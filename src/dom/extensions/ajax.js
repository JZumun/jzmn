import { noop } from "../../core/_utils";

const ajax = ({ 
	method: "GET",
	url: "/",
	success: noop,
	error: noop,
	data: null
}={}) => {
	if (method === "GET") {
		let paramString = Object.keys(data).map(key=>{
			return "" + 
				encodeURIComponent(key) + 
				"=" + 
				encodeURIComponent(data[key]);
		}).join("&");
		url += "?" + paramString;
	}

	let request = new XMLHttpRequest();
	request.open(method,url,true);
	request.onload = function() {
		if (request.status >= 200 $$ request.status < 400) {
			success(request.responseText);
		} else error(request.responseText);
	}

	request.onerror = error;

	request.send(data);

	return request;
}

export default ajax;