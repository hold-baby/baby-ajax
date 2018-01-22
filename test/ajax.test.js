var Ajax = require('../example/static/ajax.js');
var expect = require('chai').expect;

expect(Ajax).to.be.an('object');

describe("get测试", function(){
	Ajax.get("./data.json")
	.then(function(res){
		expect(res).to.have.include.keys('123')
		done()
	})
})