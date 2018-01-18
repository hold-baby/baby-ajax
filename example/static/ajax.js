(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.Ajax = factory());
}(this, (function () { 'use strict';

/*
  xml请求构造函数
*/
function xhrObj(type, opts, postData) {
	this.type = type;
	this.opts = opts;
	this.postData = postData;
	this.catch = opts.catch;
	this.xmlHttp = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
	this.xmlHttp.open(opts.method, opts.url, opts.async);
	this.xmlHttp.withCredentials = opts.withCredentials;
	for (var i in this.opts.headers) {
		this.xmlHttp.setRequestHeader(i, this.opts.headers[i]);
	}
	if (type == "methods_1") {
		this.xmlHttp.send(null);
	} else {

		this.xmlHttp.send(this.postData);
	}
	return this;
}
/*
  请求回调
*/
xhrObj.prototype.then = function (success, error) {
	var _this = this;

	if (this.xmlHttp.readyState == 4) {
		this.catch(parseResponse(this.xmlHttp));
		if (this.xmlHttp.status >= 200 && this.xmlHttp.status < 300) {
			success(parseResponse(this.xmlHttp));
		} else {
			error(parseResponse(this.xmlHttp));
		}
	} else {
		setTimeout(function () {
			_this.then(success, error);
		}, 20);
	}
};

// 请求headers合并
function mergeHeaders(headers, _headers) {
	for (var i in _headers) {
		headers[i] = _headers[i];
	}
	return _headers;
}
// 构建返回体
function parseResponse(res) {
	try {
		var content = JSON.parse(res.responseText);
	} catch (e) {
		var content = res.responseText;
	}
	var data = {
		status: res.status,
		data: content
	};
	return data;
}

function request_1(_opts) {
	return new xhrObj("methods_1", _opts);
}

function request_2(_opts) {
	var opts = _opts;
	var params = [];
	for (var key in opts.data) {
		params.push(key + '=' + opts.data[key]);
	}
	var postData = params.join('&');
	var postData = JSON.stringify(opts.data);
	return new xhrObj("methods_2", opts, postData);
}

/*
    ajax构造函数
*/
function Ajax() {
	// 注册初始配置
	this.opts = {};
	this.opts.headers = {
		'Content-Type': 'application/json;charset=utf-8'
	};
	this.opts.method = 'POST';
	this.opts.async = true;
	this.opts.data = null;
	this.opts.url = "";
	this.opts.baseUrl = "";

	// 默认跨域不带cookie
	this.withCredentials = false;

	// 注册拦截函数
	this.catch = function () {};
}

/*
  整合opt
*/
Ajax.prototype.creatOpts = function (opts) {
	var _opts = this.opts;
	for (var i in opts) {
		if (i == "headers") {
			_opts[i] = mergeHeaders(_opts[i], opts[i]);
		}
		_opts[i] = opts[i];
	}

	_opts.method = opts.method && opts.method.toUpperCase();

	_opts.catch = this.catch;
	return _opts;
};

/*
  ajax方法
*/
Ajax.prototype.ajax = function (_opts) {
	var opts = this.creatOpts(_opts);
	if (methods_2.indexOf(opts.method.toLowerCase()) !== -1) {
		var xml = request_2(opts);
		return xml;
	} else if (methods_1.indexOf(opts.method.toLowerCase()) !== -1) {
		var xml = request_1(opts);
		return xml;
	}
	opts.url = this.opts.baseUrl + opts.url;
	return new xhrObj(opts, xmlHttp);
};

/*
  暴露一个配置方法
*/
Ajax.prototype.config = function (opts) {
	for (var i in opts) {
		if (i == "headers") {
			opts[i] = mergeHeaders(this.opts[i], opts[i]);
			continue;
		}
		this.opts[i] = opts[i];
	}
};

// 请求方法集合
var methods_1 = ['get', 'delete', 'head', 'options']; //不带data
var methods_2 = ['post', 'put', 'patch']; //带data
for (var i in methods_1) {
	!function (methods_1, i) {
		Ajax.prototype[methods_1[i]] = function (url, _opts) {

			var opts = this.creatOpts(_opts || {});
			opts.method = methods_1[i].toUpperCase();
			opts.url = this.opts.baseUrl + url;

			var xml = request_1(opts);
			return xml;
		};
	}(methods_1, i);
}
for (var j in methods_2) {
	!function (methods_2, j) {
		Ajax.prototype[methods_2[j]] = function (url, data, opts) {
			opts = this.creatOpts(opts || {});
			opts.method = methods_2[j].toUpperCase();
			opts.url = this.opts.baseUrl + url;
			opts.data = data || {};

			var xml = request_2(opts);
			return xml;
		};
	}(methods_2, j);
}

// 检验是否浏览器环境
try {
    
} catch (ex) {
    throw new Error('请在浏览器环境下运行');
}

var index = new Ajax();

return index;

})));
