(function(global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) :
        (global = global || self, global.Ajax = factory());
}(this, function() {
    'use strict';

    /**
     * 合并配置项
     * @opt 			基准项
     * @opt2	 		合并项
     * return 			options
     */
    function mergeOpt(opt, opt2) {
        for (var i in opt) {

            if (i === 'headers') {
                opt2[i] = opt2[i] || {};
                for (var j in opt[i]) {
                    opt2[i][j] = opt2[i][j] || opt[i][j];
                    continue;
                }
            }

            opt2[i] = opt2[i] || opt[i];
        }

        return opt2;
    }

    /**
     * 执行请求函数
     * @opt 			请求配置
     * @resolve 		请求成功函数
     * @reject 			请求失败函数
     */
    function Xhr(opt, resolve, reject) {
        var xhr = void 0;

        if (window.XMLHttpRequest) {
            xhr = new XMLHttpRequest();
        } else {
            xhr = new ActiveXObject('Microsoft.XMLHTTP');
        }

        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                var res = '';

                // 兼容文本返回与json返回∂
                try {
                    res = JSON.parse(xhr.responseText);
                } catch (e) {
                    res = xhr.responseText ? xhr.responseText : "";
                }

                var status = xhr.status;
                var headers = xhr.getAllResponseHeaders().split('\n');
                if (xhr.status >= 200 && xhr.status < 300) {
                    // ssucess
                    resolve(res, status, headers);
                } else {
                    // error
                    reject(res, status, headers);
                }

                opt.catch(res, status, headers);
            }
        };

        xhr.open(opt.method, opt.url, opt.async);

        for (var i in opt.headers) {
            xhr.setRequestHeader(i, opt.headers[i]);
        }

        xhr.send(opt.data);
    }

    // 检测是否支持promise
    var isPromise = !!window.Promise;

    /**
     * 包裹请求函数
     * @opt 			请求配置
     * return 			返回一个promise对象,或者一个带then函数的对象
     */
    function Defer(opt) {
        var P = void 0;

        if (isPromise) {
            P = new Promise(Xhr.bind(null, opt));
        } else {
            P = {};
            P.then = function(resolve, reject) {
                Xhr.call(null, opt, resolve, reject);
            };
        }

        return P;
    }

    /**
     * 文件上传
     * @dom 		监控dom元素
     * @opt 		上传配置
     */
    function FileUpload(dom, opt) {
        var _this = this;

        var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
        xhr.onload = uploadComplete.bind(this); // 请求完成
        xhr.onerror = uploadFailed.bind(this); // 请求失败
        xhr.upload.onprogress = progressFunction.bind(this); // 上传进度调用方法实现

        var ot = void 0,
            oloaded = void 0;
        // 上传开始执行方法
        xhr.upload.onloadstart = function() {
            ot = new Date().getTime(); //设置上传开始时间
            oloaded = 0; //设置上传开始时，以上传的文件大小为0
            _this.fileItem.isUploadding = true;
        };

        this.opt = opt;
        this.xhr = xhr;
        this.dom = dom;

        // 上传成功响应
        function uploadComplete(evt) {
            this.fileItem.isUpload = true;
            this.fileItem.isUploadding = false;
            this.onSuccessItem(this.fileItem, parseBody(evt).res, parseBody(evt).status);
            this.clearUploadFile();
        }
        // 上传失败
        function uploadFailed(evt) {
            this.fileItem.isError = true;
            this.fileItem.isUploadding = false;
            this.onErrorItem(this.fileItem, parseBody(evt).res, parseBody(evt).status);
            this.clearUploadFile();
        }

        // 上传进度实现方法，上传过程中会频繁调用该方法
        function progressFunction(evt) {
            var progress = {}; // 包含上传百分百 速度
            var progressBar = {};
            if (evt.lengthComputable) {
                //
                progressBar.max = evt.total;
                progressBar.value = evt.loaded;
                progress.percent = Math.round(evt.loaded / evt.total * 100);
            }
            var nt = new Date().getTime(); // 获取当前时间
            var pertime = (nt - ot) / 1000; // 计算出上次调用该方法时到现在的时间差，单位为s
            ot = new Date().getTime(); // 重新赋值时间，用于下次计算
            var perload = evt.loaded - oloaded; // 计算该分段上传的文件大小，单位b
            oloaded = evt.loaded; // 重新赋值已上传文件大小，用以下次计算
            //上传速度计算
            var speed = perload / pertime; // 单位b/s
            var bspeed = speed;
            var units = 'b/s'; // 单位名称
            if (speed / 1024 > 1) {
                speed = speed / 1024;
                units = 'Kb/s';
            }
            if (speed / 1024 > 1) {
                speed = speed / 1024;
                units = 'Mb/s';
            }
            speed = speed.toFixed(1);
            //剩余时间
            var resttime = ((evt.total - evt.loaded) / bspeed).toFixed(1);
            progress.speed = speed + units;
            progress.resttime = resttime;

            if (bspeed == 0) progress.bspeed = '上传已取消';
            this.onProgressItem(this.fileItem, progress);
        }
    }

    FileUpload.prototype = {
        upload: function upload() {
            var file = this.dom.files[0];
            var opt = this.opt;

            var form = new FormData();
            form.append("file", file); // 文件对象
            form.append("parm", JSON.stringify(opt.data)); // 文件对象添加额外参数

            // 构建fileItem
            var fileItem = {
                formData: form,
                url: opt.url || "",
                data: opt.data || "",
                addr: this.dom.value || "",
                isUpload: false,
                isCancel: false,
                isUploadding: false,
                isError: false,
                isUploadClear: opt.isUploadClear || false,
                autoUpload: opt.autoUpload || false
            };
            this.fileItem = fileItem;

            this.xhr.open("post", this.opt.url, true); //post方式，url为服务器请求地址，true 该参数规定请求是否异步处理。
            this.onBeforeUploadItem(this.fileItem);
            this.xhr.send(this.fileItem.formData); //开始上传，发送form数据
        },
        onSuccessItem: function onSuccessItem() {},
        onBeforeUploadItem: function onBeforeUploadItem() {},
        onErrorItem: function onErrorItem() {},
        onProgressItem: function onProgressItem() {},
        clearUploadFile: function clearUploadFile() {
            if (this.fileItem.isUploadClear) {
                this.dom.value = "";
                this.dom.files = null;
            }
        },
        cancleUploadFile: function cancleUploadFile() {
            this.fileItem.isCancel = true;
            this.fileItem.isUploadding = false;
            this.fileItem.isUpload = false;
            this.xhr.abort();
            this.clearUploadFile();
        }
    };

    function parseBody(evt) {
        return {
            res: JSON.parse(evt.target.responseText),
            status: evt.target.status
        };
    }

    // 默认设置
    var defaultOpt = {
        baseUrl: '',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        // 默认异步操作
        async: true,
        // 默认跨域不带cookie
        withCredentials: false

        /**
         * Ajax构造函数
         */
    };

    function Ajax() {}

    // 请求方法集合
    var methods_1 = ['get', 'delete', 'head', 'options']; //不带data
    var methods_2 = ['post', 'put', 'patch']; //带data

    var _loop = function _loop(i) {
        Ajax.prototype[methods_1[i]] = function(url, _opts) {

            _opts = _opts || {};

            var opts = mergeOpt(defaultOpt, _opts);

            opts.method = methods_1[i].toUpperCase();

            opts.url = opts.baseUrl + url;

            opts.data = null;

            opts.catch = this.catch;

            return Defer(opts);
        };
    };

    for (var i in methods_1) {
        _loop(i);
    }

    var _loop2 = function _loop2(j) {
        Ajax.prototype[methods_2[j]] = function(url, data, _opts) {

            _opts = _opts || {};

            if (!_opts.headers) {
                _opts.headers = {};
                _opts.headers['Content-Type'] = 'application/json;charset=utf-8';
            } else {
                if (!_opts.headers['Content-Type']) {
                    _opts.headers['Content-Type'] = 'application/json;charset=utf-8';
                }
            }

            var opts = mergeOpt(defaultOpt, _opts);

            opts.method = methods_2[j].toUpperCase();

            opts.url = opts.baseUrl + url;

            opts.data = data;

            opts.catch = this.catch;

            // if(opts.data){
            // 	let cache = [];

            // 	for(let i in opts.data){
            // 		cache.push(i + '=' + opts.data[i])
            // 	}

            // 	opts.data = cache.join('&')
            // }
            opts.data = JSON.stringify(opts.data);

            return Defer(opts);
        };
    };

    for (var j in methods_2) {
        _loop2(j);
    }

    /**
     * 纯配置请求函数
     */
    Ajax.prototype.ajax = function(options) {
        try {
            var method = options.method.toLowerCase();

            if (methods_1.indexOf(method) !== -1) {
                return this[method](options.url, options);
            } else if (methods_2.indexOf(method) !== -1) {
                return this[method](options.url, options.data, options);
            } else {
                throw new Error('error');
            }
        } catch (e) {
            throw new Error(e);
        }
    };

    /** 
     * 暴露默认配置
     */
    Ajax.prototype.config = function(opt) {
        defaultOpt = mergeOpt(defaultOpt, opt);
    };

    /** 
     * 注册拦截函数
     */
    Ajax.prototype.catch = function() {};

    /** 
     * 文件上传
     */
    Ajax.prototype.uploader = function(id, _opt) {
        _opt = _opt || {};
        var opt = mergeOpt(defaultOpt, _opt);

        opt.url = opt.baseUrl + opt.url;

        var dom = document.getElementById(id);

        return new FileUpload(dom, opt);
    };

    // 检验是否浏览器环境
    try {} catch (ex) {
        throw new Error('请在浏览器环境下运行');
    }

    var index = new Ajax();

    return index;

}));