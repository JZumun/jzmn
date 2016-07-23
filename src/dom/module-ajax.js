/*
	Utility function for sending Ajax Requests. Can stand alone.

	USAGE:
	jzmn.ajax(options)

	ARGUMENTS:
		options 	-	Object containing user-defined settings:
			method		- String corresponding to HTTP method to be used. Defaults to "GET"
			url 		- String corresponding to URL.
			success		- Function callback for success;
			error		- Function callback for error;
			data		- Data to be sent
			params 		- Object, with properties corresponding to key:value pairs to be sent.

	RETURNS
		undefined
*/
var jzmn = (function (factory){
	"use strict"
	factory = factory || {};

	factory.ajax = function ajaxRequest(opts) {
		var method 	= opts.method || "GET";
		var url		= opts.url || "/";
		var callback = opts.success || function(){};
		var errorCallback = opts.error || function() {};
		var data = opts.data;
		var params = opts.params;
		
		if (params) {
			var paramString = Object.keys(params).map(function(key) {
				return "" + encodeURIComponent(key) + "=" + encodeURIComponent(params[key]);
			}).join("&");
			if (method == "GET") {
				url += "?" + paramString;
				console.log(url);
			} else {
				data = paramString;
				console.log(paramString);
			}
		}

		var request = new XMLHttpRequest();
		request.open(method,url,true);
		request.onload = function() {
			if (request.status >= 200 && request.status < 400) {
				callback(request.responseText);
			} else errorCallback();
		};
		request.onerror = errorCallback;

		request.send(data);
	}

	return factory;
})(jzmn);