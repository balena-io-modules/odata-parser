var test = require('./test')
  , assert = require('assert')

test("/something?foo=hello%20world", "OData", function(result) {
    it("should equal hello world without the encoding", function() {
        assert.equal(result.options.foo, "hello world")
    })
})

test("/some%20thing?foo=hello%20world", "OData", function(result) {
    it("should equal 'some thing' without the encoding", function() {
        assert.equal(result.resource, "some thing")
    })
})
