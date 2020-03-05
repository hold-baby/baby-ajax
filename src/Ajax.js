import { mergeOpt, copy, encode } from './utils.js'
import Defer from './Defer.js'
import FileUpload from './FileUpload.js'

// 默认设置
let defaultOpt = {
	baseUrl : '',
	headers : {
		'Content-Type' : 'application/json;charset=utf-8'
	},
	// 默认异步操作
	async : true,
	// 默认跨域不带cookie
	withCredentials : false
}

/**
 * Ajax构造函数
 */
function Ajax(){
}

// 请求方法集合
const methods_1 = ['get', 'delete', 'head', 'options'] //不带data
const methods_2 = ['post', 'put', 'patch'] //带data
for(let i in methods_1){
	Ajax.prototype[methods_1[i]] = function(url, _opts) {

		_opts = _opts || {}

		let opts = mergeOpt(defaultOpt, _opts)

		opts.method = methods_1[i].toUpperCase();

		opts.url = opts.baseUrl + url;

		opts.data = null;

		opts.catch = this.catch

		return Defer(opts)
	}	
}
for(let j in methods_2){
	Ajax.prototype[methods_2[j]] = function(url, data, _opts){

		_opts = _opts || {}

		if(!_opts.headers){
			_opts.headers = {}
			_opts.headers['Content-Type'] = 'application/json;charset=utf-8'
		}else{
			if(!_opts.headers['Content-Type']){
				_opts.headers['Content-Type'] = 'application/json;charset=utf-8'
			}
		}

		let opts = mergeOpt(defaultOpt, _opts)

		opts.method = methods_2[j].toUpperCase();

		opts.url = opts.baseUrl + url;

		opts.data = data;

		opts.catch = this.catch

		// if(opts.data){
		// 	let cache = [];

		// 	for(let i in opts.data){
		// 		cache.push(i + '=' + opts.data[i])
		// 	}

		// 	opts.data = cache.join('&')
		// }
		opts.data = JSON.stringify(opts.data)
		

		return Defer(opts)
	}
}

/**
 * 纯配置请求函数
 */
Ajax.prototype.ajax = function(options){
	try{
		let method = options.method.toLowerCase();

		if(methods_1.indexOf(method) !== -1){
			return this[method](options.url,options)
		}else if(methods_2.indexOf(method) !== -1){
			return this[method](options.url,options.data,options)
		}else{
			throw new Error('error')
		}

	} catch(e){
		throw new Error(e)
	}
}

/** 
 * 暴露默认配置
 */
Ajax.prototype.config = function(opt){
	defaultOpt = mergeOpt(defaultOpt, opt)
}

/** 
 * 注册拦截函数
 */
Ajax.prototype.catch = function(){
}

/** 
 * 文件上传
 */
Ajax.prototype.uploader = function(dom, _opt){
	_opt = _opt || {}
	let opt = mergeOpt(defaultOpt, _opt)

	opt.url = opt.baseUrl + opt.url;

	let ele = dom;
	if(typeof dom === "string"){
		ele = document.getElementById(dom)
	}

	return new FileUpload(ele, opt)
}

export default Ajax