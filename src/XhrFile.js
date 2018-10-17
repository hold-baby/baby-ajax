import {parseFileRes} from './Common.js'
/*
  xml上传文件
*/
function XhrFile(opt, dom){
    var _this = this;
    this.dom = dom;
    this.opt = opt;

    this.xmlHttp = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
    this.xmlHttp.onload = uploadComplete; // 请求完成
    this.xmlHttp.onerror =  uploadFailed; // 请求失败
    this.xmlHttp.upload.onprogress = progressFunction;  // 上传进度调用方法实现

    this.onSuccessItem  = function(){};
    this.onBeforeUploadItem = function(){};
    this.onErrorItem = function(){};
    this.onProgressItem = function(){};

    var ot, oloaded;
    this.xmlHttp.upload.onloadstart = function(){//上传开始执行方法
        ot = new Date().getTime();   //设置上传开始时间
        oloaded = 0;  //设置上传开始时，以上传的文件大小为0
        _this.fileItem.isUploadding = true;
    };

    // 给input绑定change事件
    this.dom.onchange = function(){
        if(_this.opt.autoUpload || false){
            _this.upload()
        }
    }
    
    
    //上传成功响应
    function uploadComplete(evt) {
        //服务断接收完文件返回的结果
        var res = parseFileRes(evt).res;
        var status = parseFileRes(evt).status;
        _this.fileItem.isUpload = true;
        _this.fileItem.isUploadding = false;
        _this.onSuccessItem(_this.fileItem, res, status)
        _this.clearUploadFile()
    }
    //上传失败
    function uploadFailed(evt) {
        var res = parseFileRes(evt).res;
        var status = parseFileRes(evt).status;
        _this.fileItem.isError = true;
        _this.fileItem.isUploadding = false;
        _this.onErrorItem(_this.fileItem, res, status)
        _this.clearUploadFile()
    }
    
    //上传进度实现方法，上传过程中会频繁调用该方法
    function progressFunction(evt) {
        var progress = {};  // 包含上传百分百 速度
        var progressBar = {};
        if (evt.lengthComputable) {//
            progressBar.max = evt.total;
            progressBar.value = evt.loaded;
            progress.percent = Math.round(evt.loaded / evt.total * 100);
        }
        var nt = new Date().getTime();//获取当前时间
        var pertime = (nt-ot)/1000; //计算出上次调用该方法时到现在的时间差，单位为s
        ot = new Date().getTime(); //重新赋值时间，用于下次计算
        var perload = evt.loaded - oloaded; //计算该分段上传的文件大小，单位b
        oloaded = evt.loaded;//重新赋值已上传文件大小，用以下次计算
        //上传速度计算
        var speed = perload/pertime;//单位b/s
        var bspeed = speed;
        var units = 'b/s';//单位名称
        if(speed/1024>1){
            speed = speed/1024;
            units = 'kb/s';
        }
        if(speed/1024>1){
            speed = speed/1024;
            units = 'Mb/s';
        }
        speed = speed.toFixed(1);
        //剩余时间
        var resttime = ((evt.total-evt.loaded)/bspeed).toFixed(1);
        progress.speed = speed + units;
        progress.resttime = resttime;

        if(bspeed==0) progress.bspeed = '上传已取消';
        _this.onProgressItem(_this.fileItem, progress)
    }
}

// 开始上传
XhrFile.prototype.upload = function(){
    if(!this.dom.value) return
    var _this = this;

    var fileObj = this.dom.files[0]; // js 获取文件对象
    var form = new FormData();
    form.append("file", fileObj); // 文件对象
    form.append("parm", JSON.stringify(this.opt.data)); // 文件对象添加额外参数

    // 构建fileItem
    var fileItem = {
        formData : form,
        url : this.opt.url || "",
        data : this.opt.data || "",
        addr : this.dom.value || "",
        isUpload : false,
        isCancel : false,
        isUploadding : false,
        isError : false,
        isUploadClear : this.opt.isUploadClear || false,
        autoUpload : this.opt.autoUpload || false
    }

    this.fileItem = fileItem;
    
    // 怎么延时确保自定义函数已绑定
    setTimeout(function(){
        _this.onBeforeUploadItem(_this.fileItem)
        _this.xmlHttp.open("post", _this.fileItem.url, true); //post方式，url为服务器请求地址，true 该参数规定请求是否异步处理。

        if(_this.opt.headers){
            for(var i in _this.opt.headers){
                _this.xmlHttp.setRequestHeader(i, _this.opt.headers[i]);
            }
        }

        _this.xmlHttp.send(_this.fileItem.formData); //开始上传，发送form数据
    }, 20)

}

// 取消上传
XhrFile.prototype.cancleUploadFile = function(){
    _this.fileItem.isCancel = true;
    _this.fileItem.isUploadding = false;
    _this.fileItem.isUpload = false;
    this.xmlHttp.abort()
    this.clearUploadFile()
}
// 清除文件
XhrFile.prototype.clearUploadFile = function(){
    if(this.fileItem.isUploadClear){
        // this.dom.outerHTML = this.dom.outerHTML;
        this.dom.value = "";
        this.dom.files[0] = null;
    }
}

export default XhrFile