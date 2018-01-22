window.expect = window.chai.expect;
var addr = "http://127.0.0.1:10010";

Ajax.catch = function(res){
	console.log("catch",res)
}

describe("ajax测试", function(){
	it("get", function(done){
		Ajax.get(addr + "/ajax/get?u=1", {"Asdf" : "asdf"})
		.then(function(res){
			expect(res).to.have.include.keys('data','status')
			done()
		}, function(res){
			expect(res).to.have.include.keys('data','status')
			done()
		})
	})
	it("post", function(done){
		Ajax.post(addr + "/ajax/post", {"Asdf" : "asdf"})
		.then(function(res){
			expect(res).to.have.include.keys('data','status')
			done()
		}, function(res){
			expect(res).to.have.include.keys('data','status')
			done()
		})
	})
})