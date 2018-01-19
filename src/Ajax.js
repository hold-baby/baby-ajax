import {mergeHeaders, request_1, request_2} from './Common.js'
import xhrObj from './Xhr.js'

window.MOBLIE_CATCH = [];  //预留mobile拦截数组

/*
    ajax构造函数
*/
function Ajax(){
	// 注册初始配置
	this.opts = {};
	this.opts.headers = {
		'Content-Type' : 'application/json;charset=utf-8',
	};
	this.opts.method = 'POST';
	this.opts.async = true;
	this.opts.data = null;
	this.opts.url = "";
	this.opts.baseUrl = "";

	// 默认跨域不带cookie
	this.withCredentials = false;

	// 注册拦截函数
	this.catch = function(){};

	// 移动端请求句柄
	this.mobileHandle = null;
}



/*
  整合opt
*/
Ajax.prototype.creatOpts = function (opts){
	var _opts = this.opts;
	for(var i in  opts){
		if(i == "headers"){
			_opts[i] = mergeHeaders(_opts[i], opts[i])
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
Ajax.prototype.ajax = function(_opts){
	var opts = this.creatOpts(_opts)
	var _this= this;
    if (methods_2.indexOf(opts.method.toLowerCase()) !== -1) {
    	var xml = request_2(opts)
	    return xml
    }else if (methods_1.indexOf(opts.method.toLowerCase()) !== -1) {
        var xml = request_1(opts)
		return xml
    }
    opts.url = this.opts.baseUrl + opts.url;
    return new xhrObj(opts, xmlHttp)
};

/*
  暴露一个配置方法
*/
Ajax.prototype.config = function(opts){
	for(var i in opts){
		if(i == "headers"){
			opts[i] = mergeHeaders(this.opts[i], opts[i])
			continue
		}
		this.opts[i] = opts[i]
	}
}


// 请求方法集合
var methods_1 = ['get', 'delete', 'head', 'options']; //不带data
var methods_2 = ['post', 'put', 'patch']; //带data
for(var i in methods_1){
	!function(methods_1, i){
		Ajax.prototype[methods_1[i]] = function(url, _opts){

			var opts = this.creatOpts(_opts || {})
			opts.method = methods_1[i].toUpperCase();
			opts.url = this.opts.baseUrl + url;

			var xml = request_1(opts)
			return xml
		}	
	}(methods_1, i)
};
for(var j in methods_2){
	!function(methods_2, j){
		Ajax.prototype[methods_2[j]] = function(url, data, opts){
			opts = this.creatOpts(opts || {})
			opts.method = methods_2[j].toUpperCase();
			opts.url = this.opts.baseUrl + url;
			opts.data = data || {};

			var xml = request_2(opts)
	        return xml
		}
	}(methods_2, j)
};

export default Ajax