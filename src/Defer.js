import Xhr from './Xhr.js'

// 检测是否支持promise
const isPromise = !!window.Promise

/**
 * 包裹请求函数
 * @opt 			请求配置
 * return 			返回一个promise对象,或者一个带then函数的对象
 */
function Defer(opt){
	let P;

	if(isPromise){
		P = new Promise(Xhr.bind(null, opt))
	}else{
		P = {};
		P.then = function(resolve, reject){
			Xhr.call(null, opt, resolve, reject)
		}
	}

	return P
}

export default Defer