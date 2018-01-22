describe("get测试", function(){
	Ajax.get("data.json")
	.then(function(res){
		expect(res).to.have.include.keys('data')
		done()
	})
})