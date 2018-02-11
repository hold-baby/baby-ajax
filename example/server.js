var express = require("express");
var path = require("path");
var fs = require("fs");
var bodyParser = require('body-parser');
var formidable = require('formidable');
var util = require('util');
var opn = require("opn")
var exec = require("child_process").exec;


var app = express();
var static = express();
static.use('/', express.static("static"));

app.all("*", function(req, res, next){
    // res.header("Access-Control-Allow-Origin", "*");  
    res.header("Access-Control-Allow-Origin", req.headers.origin);  
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, X-File-Name, Authorization");  
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS,PATCH");  
    res.header("Access-Control-Allow-Credentials","true");  
    res.header("Content-Type", "application/json;charset=utf-8"); 
    res.header("X-Powered-By",' 3.2.1');
    res.header("Cache-Control","no-store"); 
    if (req.method == 'OPTIONS') {
        res.sendStatus(200).end();  //让options请求快速返回/
    }else {
        next();
    }
})

app.use('/',bodyParser.json({limit: '1mb'}));  //这里指定参数使用 json 格式
app.use('/',bodyParser.urlencoded({
  extended: true
}));

var arr = [200, 203, 302, 304, 400, 401];
function creatStatus(){
	return arr[Math.floor((Math.random()*arr.length))]; 
}
app.get("/ajax/get", function(req, res){
	var query = req.query;
	res.status(creatStatus()).send({
		des : query
	})
})
app.delete("/ajax/delete", function(req, res){
	var query = req.query;
	res.status(creatStatus()).send({
		des : query
	})
})
app.head("/ajax/head", function(req, res){
	var query = req.query;
	res.status(creatStatus()).send({
		des : query
	})
})
app.options("/ajax/options", function(req, res){
	var query = req.query;
	res.status(creatStatus()).send({
		des : query
	})
})
app.post("/ajax/post", function(req, res){
	var query = req.body;
	res.status(creatStatus()).send({
		des : query
	})
})
app.put("/ajax/put", function(req, res){
	var query = req.body;
	res.status(creatStatus()).send({
		des : query
	})
})
app.patch("/ajax/patch", function(req, res){
	var query = req.body;
	res.status(creatStatus()).send({
		des : query
	})
})

var uploadDir = path.join(__dirname + '/fileTmp')  //文件保存的临时目录为当前项目下的tmp文件夹  
var maxFieldsSize = 1 * 1024 * 1024;  // 文件大小限制为最大1M 
var targetDir = path.join(__dirname + '/public'); //文件移动的目录文件夹，不存在时创建目标文件夹 
// var allowFile = '.jpg.jpeg.png.gif';  // 允许上传的类型
var allowFile = ['.jpg','.jpeg','.png','.gif'];  // 允许上传的类型
var limitFile = [];  // 禁止上传的类型
var limitType = 0; // 1 : allowFile; 0 : limitFile

app.post("/ajax/upload",function(req,res){
	var form  = new formidable.IncomingForm();
	form.uploadDir = uploadDir;   
    form.maxFieldsSize =    maxFieldsSize
    form.keepExtensions = true;        //使用文件的原扩展名 
	form.parse(req,function(err,fields,file){  // fields额外参数
		var filePath = "";
		if(file.tmpFile){  
            filePath = file.tmpFile.path;  
        } else {  
            for(var key in file){  
                if( file[key].path && filePath==='' ){  
                    filePath = file[key].path;  
                    break;  
                }  
            }  
        }
         
        if (!fs.existsSync(targetDir)) {  
            fs.mkdir(targetDir);  
        }
        var fileExt = filePath.substring(filePath.lastIndexOf('.'));
        var isAllowUpload = false // 是否允许上传
        if(limitType == 1){
            isAllowUpload = allowFile.some(function(type){
                return fileExt.toLowerCase() == type
            })
        }else{
            isAllowUpload = !limitFile.some(function(type){
                return fileExt.toLowerCase() == type
            })
        }
        if(isAllowUpload){  
            //以当前时间戳对上传文件进行重命名  
            var fileName = new Date().getTime() + fileExt;  
            var targetFile = path.join(targetDir, fileName);  
            //移动文件  
            fs.rename(filePath, targetFile, function (err) {  
                if(err){  
                    console.info(err);  
                    res.status(400).send({
                        message : "操作失败"
                    }).end();
                }else{  
                    res.status(200).send({
                        message : "操作成功"
                    }).end();
                }  
            });  
        }else{
            var err = new Error('此文件类型不允许上传');  
            res.status(400).send({
                message : "此文件类型不允许上传"
            }).end();
        } 
	})
})



app.listen(10010, function(){
	console.log("ajax server is open at 10010")
})
var STATIC_PROT = 10011
static.listen(STATIC_PROT, function(){
	console.log("static server is open at 10011")
	opn("http://127.0.0.1:" + STATIC_PROT)
})

var cmd = "cd .. && npm run example";
var dev = exec(cmd, function(error, stdout, stderr){
	console.log(error)
	console.log(stdout)
	console.log(stderr)
})
dev.stdout.on("data", function(m){
	console.log(m.toString())
})