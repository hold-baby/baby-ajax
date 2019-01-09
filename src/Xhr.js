/**
 * 执行请求函数
 * @opt 			请求配置
 * @resolve 		请求成功函数
 * @reject 			请求失败函数
 */
function Xhr(opt, resolve, reject){
	let xhr;

	if(window.XMLHttpRequest){
		xhr = new XMLHttpRequest()
	}else{
		xhr = new ActiveXObject('Microsoft.XMLHTTP')
	}

	xhr.onreadystatechange = function(){
		if(xhr.readyState === 4){
			let res = xhr.responseText ? JSON.parse(xhr.responseText) : ''
			let status = xhr.status
			let headers = xhr.getAllResponseHeaders().split('\n')
			if(xhr.status >= 200 && xhr.status < 300){
				// ssucess
				resolve(res, status, headers)
			}else{
				// error
				reject(res, status, headers)
			}

			opt.catch(res, status, headers)

		}
	}

	xhr.open(opt.method,opt.url,opt.async)

	for(let i in opt.headers){
		xhr.setRequestHeader(i,opt.headers[i])
	}

	xhr.send(opt.data)	
};

export default Xhr