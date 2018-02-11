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
	this.mobileHandle = opts.mobileHandle;
	this.xmlHttp = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');

	if (!!this.mobileHandle && typeof this.mobileHandle == 'function') {
		MOBLIE_CATCH.push(this.xmlHttp);
		this.mobileHandle();
	}

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

// 构建上传返回体
function parseFileRes(evt) {
	return {
		res: JSON.parse(evt.target.responseText),
		status: evt.target.status
	};
}

/*
  xml上传文件
*/
function XhrFile(fileItem, dom) {
    var _this = this;
    this.dom = dom;
    this.fileItem = fileItem;

    this.xmlHttp = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
    this.xmlHttp.onload = uploadComplete; // 请求完成
    this.xmlHttp.onerror = uploadFailed; // 请求失败
    this.xmlHttp.upload.onprogress = progressFunction; // 上传进度调用方法实现

    this.onSuccessItem = function () {};
    this.onBeforeUploadItem = function () {};
    this.onErrorItem = function () {};
    this.onProgressItem = function () {};

    var ot, oloaded;
    this.xmlHttp.upload.onloadstart = function () {
        //上传开始执行方法
        ot = new Date().getTime(); //设置上传开始时间
        oloaded = 0; //设置上传开始时，以上传的文件大小为0
        _this.fileItem.isUploadding = true;
    };

    // 怎么延时确保自定义函数已绑定
    setTimeout(function () {
        _this.onBeforeUploadItem(fileItem);
        _this.xmlHttp.open("post", fileItem.url, true); //post方式，url为服务器请求地址，true 该参数规定请求是否异步处理。
        fileItem.formData.append("parm", JSON.stringify(fileItem.data)); // 文件对象添加额外参数
        _this.xmlHttp.send(fileItem.formData); //开始上传，发送form数据
    }, 100);

    //上传成功响应
    function uploadComplete(evt) {
        //服务断接收完文件返回的结果
        var res = parseFileRes(evt).res;
        var status = parseFileRes(evt).status;
        _this.fileItem.isUpload = true;
        _this.fileItem.isUploadding = false;
        _this.onSuccessItem(_this.fileItem, res, status);
        _this.clearUploadFile();
    }
    //上传失败
    function uploadFailed(evt) {
        var res = parseFileRes(evt).res;
        var status = parseFileRes(evt).status;
        _this.fileItem.isError = true;
        _this.fileItem.isUploadding = false;
        _this.onErrorItem(_this.fileItem, res, status);
        _this.clearUploadFile();
    }

    //上传进度实现方法，上传过程中会频繁调用该方法
    function progressFunction(evt) {
        var progress = {}; // 包含上传百分百 速度
        var progressBar = {};
        if (evt.lengthComputable) {
            //
            progressBar.max = evt.total;
            progressBar.value = evt.loaded;
            progress.percent = Math.round(evt.loaded / evt.total * 100);
        }
        var nt = new Date().getTime(); //获取当前时间
        var pertime = (nt - ot) / 1000; //计算出上次调用该方法时到现在的时间差，单位为s
        ot = new Date().getTime(); //重新赋值时间，用于下次计算
        var perload = evt.loaded - oloaded; //计算该分段上传的文件大小，单位b
        oloaded = evt.loaded; //重新赋值已上传文件大小，用以下次计算
        //上传速度计算
        var speed = perload / pertime; //单位b/s
        var bspeed = speed;
        var units = 'b/s'; //单位名称
        if (speed / 1024 > 1) {
            speed = speed / 1024;
            units = 'kb/s';
        }
        if (speed / 1024 > 1) {
            speed = speed / 1024;
            units = 'Mb/s';
        }
        speed = speed.toFixed(1);
        //剩余时间
        var resttime = ((evt.total - evt.loaded) / bspeed).toFixed(1);
        progress.speed = speed + units;
        progress.resttime = resttime;

        if (bspeed == 0) progress.bspeed = '上传已取消';
        _this.onProgressItem(_this.fileItem, progress);
    }
}

// 取消上传
XhrFile.prototype.cancleUploadFile = function () {
    console.log("cancleUploadFile");
    _this.fileItem.isCancel = true;
    _this.fileItem.isUploadding = false;
    _this.fileItem.isUpload = false;
    this.xmlHttp.abort();
    this.clearUploadFile();
};
// 清除文件
XhrFile.prototype.clearUploadFile = function () {
    if (this.fileItem.isUploadClear) {
        this.dom.value = "";
    }
};

window.MOBLIE_CATCH = []; //预留mobile拦截数组

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

	// 移动端请求句柄
	this.mobileHandle = null;
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
	_opts.mobileHandle = this.mobileHandle;
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

/*
  文件上传
*/
Ajax.prototype.uploader = function (id, opt) {
	var dom = document.getElementById(id);
	var fileObj = dom.files[0]; // js 获取文件对象
	var form = new FormData();
	form.append("file", fileObj); // 文件对象

	// 构建fileItem
	var fileItem = {
		formData: form,
		url: opt.url,
		data: opt.data || "",
		addr: dom.value,
		isUpload: false,
		isCancel: false,
		isUploadding: false,
		isError: false,
		isUploadClear: false
	};

	return new XhrFile(fileItem, dom);
};

// 检验是否浏览器环境
try {
    
} catch (ex) {
    throw new Error('请在浏览器环境下运行');
}

var index = new Ajax();

return index;

})));
