var addr = "http://127.0.0.1:10010"


function on(id,fn){
	var ele = document.getElementById(id);
	ele.addEventListener("click",fn,false)
}
Ajax.catch = function(res){
	console.log("catch")
}
Ajax.config({
	headers : {
		'Authorization' : "test"
	},
	withCredentials : true,
	baseUrl : addr,
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
	Ajax.put(addr + "/ajax/put", data, {}).then(function(res){
		console.log(res)
	}, function(res){
		console.log(res)
	})
})
on("patch",function(){
	var data = {
		des : "patch"
	}
	Ajax.patch(addr + "/ajax/patch", data, {}).then(function(res){
		console.log(res)
	}, function(res){
		console.log(res)
	})
})
on("fileId",function(){
	var fileInput = document.getElementById("fileUpload")
	var uploader = Ajax.uploader("fileUpload", {
		url : addr + "/ajax/upload",
		isUploadClear : true,
		data : ["asdf","fsda"]
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
		console.log(item.isUpload)
	}
})
function showDes(str){
	var des = document.getElementById("des");
	des.innerHTML = str;
}