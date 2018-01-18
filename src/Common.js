import xhrObj from './Xhr.js'

// 请求headers合并
export function mergeHeaders(headers, _headers){
	for(var i in _headers){
		headers[i] = _headers[i]
	}
	return _headers
};
// 构建返回体
export function parseResponse(res){
	try{
		var content = JSON.parse(res.responseText)
	}catch (e){
		var content = res.responseText
	}
	var data = {
		status : res.status,
		data : content
	}
	return data
};

export function request_1(_opts){
	return new xhrObj("methods_1", _opts)
};

export function request_2(_opts){
	var opts = _opts
	var params = [];
	for (var key in opts.data){
        params.push(key + '=' + opts.data[key]);
    }
    var postData = params.join('&');
    var postData = JSON.stringify(opts.data);
    return new xhrObj("methods_2", opts, postData)
}