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

var arr = [200, 203, 302, 400, 401];
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

// 上传临时目录
const tmpdir = path.resolve(__dirname + '/fileTmp');
// 目标部署目录
const targetDir = path.resolve(__dirname + '/public');

// 文件大小限制 => 1M
// const maxFieldsSize = 1 * 1024 * 1024;
const maxFieldsSize = '';

app.post("/ajax/upload",function(req,res){
    let form  = new formidable.IncomingForm();

    // 判断是否有临时目录 如果没有则创建
    if (!fs.existsSync(tmpdir)) {  
        fs.mkdir(tmpdir, () => {});  
    }

    // 把文件上传至临时目录
    form.uploadDir = tmpdir;
    // 设置接受的文件大小限制
    // form.maxFieldsSize = maxFieldsSize;
    // 使用文件的原扩展名
    form.keepExtensions = true; 

    form.parse(req, (err,fields,file) => {

        let filePath = ""; // 文件的目录层级
        let fileName = ""; // 文件原始名字

        // 查找文件相关信息
        if(file.tmpFile){  
            filePath = file.tmpFile.path;  
        } else {  
            for(let key in file){  
                if( file[key].path && filePath ==='' ){  
                    filePath = file[key].path;  
                    fileName = file[key].name;
                    break;  
                }  
            }  
        }
        
        // 判断是否有部署目录 如果没有则创建
        if (!fs.existsSync(targetDir)) {  
            fs.mkdir(targetDir, () => {});  
        }

        // 获取文件后缀名
        const fileExt = filePath.substring(filePath.lastIndexOf('.'));

        // 修改文件名为原文件名
        const targetName = path.join(tmpdir, fileName);

        fs.rename(filePath ,targetName, (err) => {
            if (err) {  
                console.info(err);
                res.status(400).send('400').end('上传失败');
            } else { 
                res.status(200).send('200').end();

            } 
        })
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