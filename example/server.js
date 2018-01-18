var express = require("express");
var bodyParser = require('body-parser');
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