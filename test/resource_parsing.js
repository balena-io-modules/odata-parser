var ODataParser = require('../odataparser.js').ODataParser
var assert = require('assert')

function test(input, entry, expectation) {
  describe("Parsing " + input, function() {
    var parser = ODataParser.createInstance()
    var result = parser.matchAll(input, entry)
    expectation(result)
  });
}

test("/", "OData", function(result) {
  it("Service root should have no model", function() {
     assert.equal(result.resource, null)
  })
})

test("/model", "OData", function(result) {
  it("should have the resource specified", function() {
     assert.equal(result.resource, 'model')
  })
})

test("/model(1)", "OData", function(result) {
  it("should have the resource specified", function() {
     assert.equal(result.resource, 'model')
  })
  it("should have the key specified for the source", function() {
     assert.equal(result.key, '1')
  })
})

test("/model(1)/child", "OData", function(result) {
  it("should have the resource specified", function() {
     assert.equal(result.resource, 'model')
  })
  it("should have the resource specified", function() {
     assert.equal(result.resource, 'model')
  })
  it("should have the key specified for the resource", function() {
     assert.equal(result.key, '1')
  })
  it("should have the child specified", function() {
     assert.equal(result.next.resource, 'child')
  })
})

