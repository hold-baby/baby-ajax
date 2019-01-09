var addr = "http://127.0.0.1:10010"

function on(id,fn){
	var ele = document.getElementById(id);
	try{
		ele.addEventListener("click",fn,false)
	}catch(e){
		ele.attachEvent("click",fn)
	}
};

Ajax.catch = function(res,status,headers){
};
Ajax.config({
	headers : {
		'Authorization' : "test"
	},
	withCredentials : true,
	baseUrl : addr
})

on("ajax", function(){
	Ajax.ajax({
		url : "/ajax/get?u=1",
		method : "GET"
	}).then(function(res){
		console.log(res)
	}, function(res){
		console.log(res)
	})
})
on("get",function(){
	Ajax.get("/ajax/get?u=get", {}).then(function(res){
		console.log(res)
	}, function(res){
		console.log(res)
	})
})
on("delete",function(){
	Ajax.delete("/ajax/delete?u=delete").then(function(res){
		console.log(res)
	}, function(res){
		console.log(res)
	})
})
on("head",function(){
	Ajax.head("/ajax/head?u=head").then(function(res){
		console.log(res)
	}, function(res){
		console.log(res)
	})
})
on("options",function(){
	Ajax.options("/ajax/options?u=options").then(function(res){
		console.log(res)
	}, function(res){
		console.log(res)
	})
})
on("post",function(){
	var data = {
		des : "post"
	}
	Ajax.post("/ajax/post", data, {}).then(function(res){
		console.log(res)
	}, function(res){
		console.log(res)
	})
})
on("put",function(){
	var data = {
		des : "put"
	}
	Ajax.put("/ajax/put").then(function(res){
		console.log(res)
	}, function(res){
		console.log(res)
	})
})
on("patch",function(){
	var data = {
		des : "patch"
	}
	Ajax.patch("/ajax/patch", data, {}).then(function(res){
		console.log(res)
	}, function(res){
		console.log(res)
	})
})
var file = document.getElementById('fileUpload').files[0];

var uploader = Ajax.uploader('fileUpload', {
	url : "/ajax/upload",
	isUploadClear : true,
	data : ["asdf","fsda"],
	autoUpload : false
})
uploader.onBeforeUploadItem = function(item){
	item.data = {
		"123" : 321
	}
}
uploader.onSuccessItem  = function(item, res, status){
	console.log(item);
}
uploader.onErrorItem  = function(item, res, status){
	console.log(item)
}
uploader.onProgressItem  = function(item, progress){
	console.log(progress)
}
on("fileId",function(){
	console.log(file)

	uploader.upload()
})
function showDes(str){
	var des = document.getElementById("des");
	des.innerHTML = str;
}