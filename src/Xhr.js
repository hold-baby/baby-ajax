import {mergeHeaders, parseResponse} from './Common.js'
/*
  xml请求构造函数
*/
function xhrObj(type, opts, postData){
	this.type = type;
	this.opts = opts;
	this.postData = postData;
	this.catch = opts.catch || function(){};
	this.xmlHttp = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');

	this.xmlHttp.open(opts.method, opts.url, opts.async);
	this.xmlHttp.withCredentials = opts.withCredentials;
	for(var i in this.opts.headers){
		this.xmlHttp.setRequestHeader(i, this.opts.headers[i]);
	}
	if(type == "methods_1"){
	    this.xmlHttp.send(null);
	}else{
        
        this.xmlHttp.send(this.postData);
	}
	return this
};
/*
  请求回调
*/
xhrObj.prototype.then = function(success, error){
	var _this = this;
		
	if (this.xmlHttp.readyState == 4) {
		this.catch(parseResponse(this.xmlHttp))
        if(this.xmlHttp.status >= 200 && this.xmlHttp.status < 300){
        	success(parseResponse(this.xmlHttp))
        }else{
            error(parseResponse(this.xmlHttp))
        }
    }else{
    	setTimeout(function(){
    		_this.then(success, error)
    	},20)
    }
};

export default xhrObj