/**
 * 合并配置项
 * @opt 			基准项
 * @opt2	 		合并项
 * return 			options
 */
export function mergeOpt(opt,opt2){
	for(let i in opt){

		if(i === 'headers'){
			opt2[i] = opt2[i] || {};
			for(let j in opt[i]){
				opt2[i][j] = opt2[i][j] || opt[i][j]
				continue
			}
		}

		opt2[i] = opt2[i] || opt[i];
	}

	return opt2
};

/**
 * 拷贝对象
 */
export function copy(obj){
	return JSON.parse(JSON.stringify(obj))
}

/**
 * uri编码
 */
export function encode(str) {
    return encodeURIComponent(str)
}

/**
 * uri解码
 */
export function decode(str) {
    return decodeURIComponent(str)
}
