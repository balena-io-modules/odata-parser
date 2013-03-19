var test = require('./test')
  , assert = require('assert')

test("/Categories?$format=application/atom+xml", "OData", function(result) {
  it("has a valid $format value", function() {
    assert.equal(result.options.$format, "application/atom+xml")
  })
})
