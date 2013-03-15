var ODataParser = require('../odataparser.js').ODataParser
var assert = require('assert')

function test(input, entry, expectation) {
  describe("Parsing " + input, function() {
    var parser = ODataParser.createInstance()
    var result = parser.matchAll(input, entry)
    expectation(result)
  });
}


test("/model", "ResourceUri", function(result) {
  it("should have the resource specified", function() {
     assert.equal(result.resource, 'model')
  })
})

test("/", "OData", function(result) {
  it("Should have no model", function() {
     assert.equal(result.resource, null)
  })
})


