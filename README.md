# baby-ajax
One is only 5KB ajax library
# NPM

```
npm install baby-ajax
```
# Example

```
Ajax.config({
  baseUrl : "http://127.0.0.1:10010"  //配置一个默认地址
})
Ajax.ajax({
  method : "GET",
  url : "/ajax/get?u=1"
}).then(function(res){
  console.log(res)
}, function(res){
  console.log(res)
})

Ajax.get('/ajax/get', {
  headers : {
		'Authorization' : "test"
	}
}).then(function(res){
  console.log(res)
}, function(res){
  console.log(res)
})

Ajax.post('/ajax/post', {
    a : '123'
}, {}).then(function(res){
  console.log(res)
}, function(res){
  console.log(res)
})
```

# API
```
Ajax.get(url, opt)
Ajax.delete(url, opt)
Ajax.post(url, data, opt)
Ajax.put(url, data, opt)
Ajax.patch(url, data, opt)
Ajax.config(opt)  //默认配置
Ajax.catch = function(){ /*  your code  */ }  //请求返回后的统一拦截处理
```

# opt
```
{
  method : "GET"  // 请求方法，只有在使用 Ajax.get(url, opt)方法时生效
  url : "http://127.0.0.1:10010/ajax/get",  // url
  baseYrl : "",  // 基础地址  最后的 url = baseUrl + url
  async : true,  // true : 异步, false : 同步  默认为true
  data : {},  // 请求参数
}
```
