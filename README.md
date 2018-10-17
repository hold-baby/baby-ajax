# baby-ajax
One is only 5KB ajax library
# NPM

```bash
npm install baby-ajax
```
# Example

```js
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

```js
Ajax.get(url, opt)
Ajax.delete(url, opt)
Ajax.post(url, data, opt)
Ajax.put(url, data, opt)
Ajax.patch(url, data, opt)
Ajax.config(opt)  //默认配置
Ajax.catch = function(){ /*  your code  */ }  //请求返回后的统一拦截处理
```

# opt
```js
{
  method : "GET"  // 请求方法，只有在使用 Ajax.get(url, opt)方法时生效
  url : "http://127.0.0.1:10010/ajax/get",  // url
  baseUrl : "",  // 基础地址  最后的 url = baseUrl + url
  async : true,  // true : 异步, false : 同步  默认为true
  data : {},  // 请求参数
}
```
# uploader

```js
var uploader = Ajax.uploader(id, opt)  // id为input[type=file]的id  opt为配置对象
uploader.onBeforeUploadItem = function(fileItem){
  // 上传前回调
}
uploader.onSuccessItem  = function(fileItem, res, status){
  // 上传成功回调
}
uploader.onErrorItem  = function(fileItem, res, status){
  // 上传失败回调
}
uploader.onProgressItem  = function(fileItem, progress){
  // 正在上传回调
}
uploader.upload()  // 开始上传
```
## uploader opt

```js
var opt = {
  url : url,  // 上传地址
  isUploadClear : false,  // 上传成功或失败后是否清除文件对象
  data : data,  // 上传附带参数
  autoUpload : false  // 是否添加后自动上传
}
```