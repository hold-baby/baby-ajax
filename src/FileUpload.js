function FileUpload(dom, opt){

	let xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
	xhr.onload = uploadComplete.bind(this); // 请求完成
    xhr.onerror =  uploadFailed.bind(this); // 请求失败
    xhr.upload.onprogress = progressFunction.bind(this);  // 上传进度调用方法实现

    let ot, oloaded;
    xhr.upload.onloadstart = () => {//上传开始执行方法
        ot = new Date().getTime();   //设置上传开始时间
        oloaded = 0;  //设置上传开始时，以上传的文件大小为0
        this.fileItem.isUploadding = true;
    };


    this.opt = opt;
    this.xhr = xhr;
    this.dom = dom;


    // 上传成功响应
	function uploadComplete(evt) {
	    //服务断接收完文件返回的结果
	    var res = parseFileRes(evt).res;
	    var status = parseFileRes(evt).status;
	    this.fileItem.isUpload = true;
	    this.fileItem.isUploadding = false;
	    this.onSuccessItem(this.fileItem, res, status)
	    this.clearUploadFile()
	}
	// 上传失败
	function uploadFailed(evt) {
	    var res = parseFileRes(evt).res;
	    var status = parseFileRes(evt).status;
	    this.fileItem.isError = true;
	    this.fileItem.isUploadding = false;
	    this.onErrorItem(this.fileItem, res, status)
	    this.clearUploadFile()
	}

	// 上传进度实现方法，上传过程中会频繁调用该方法
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
	    this.onProgressItem(this.fileItem, progress)
	}
}

FileUpload.prototype = {
	upload : function(){

		var file = this.dom.files[0];
		var opt = this.opt;

		var form = new FormData();
	    form.append("file", file); // 文件对象
	    form.append("parm", JSON.stringify(opt.data)); // 文件对象添加额外参数

	    // 构建fileItem
	    var fileItem = {
	        formData : form,
	        url : opt.url || "",
	        data : opt.data || "",
	        addr : this.dom.value || "",
	        isUpload : false,
	        isCancel : false,
	        isUploadding : false,
	        isError : false,
	        isUploadClear : opt.isUploadClear || false,
	        autoUpload : opt.autoUpload || false
	    }
    	this.fileItem = fileItem;

    	this.xhr.open("post", this.opt.url, true); //post方式，url为服务器请求地址，true 该参数规定请求是否异步处理。
		this.onBeforeUploadItem(this.fileItem)
        this.xhr.send(this.fileItem.formData); //开始上传，发送form数据

	},
	onSuccessItem : function(){},
	onBeforeUploadItem : function(){},
	onErrorItem : function(){},
	onProgressItem : function(){},
	clearUploadFile : function(){
	    if(this.fileItem.isUploadClear){
	        this.dom.value = "";
	        this.dom.files = null;
	    }
	},
	cancleUploadFile : function(){
	    this.fileItem.isCancel = true;
	    this.fileItem.isUploadding = false;
	    this.fileItem.isUpload = false;
	    this.xhr.abort()
	    this.clearUploadFile()
	}
};

function parseFileRes(evt){
	return {
		res : JSON.parse(evt.target.responseText),
		status : evt.target.status
	}
};

export default FileUpload