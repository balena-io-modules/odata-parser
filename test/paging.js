var assert = require('assert')
, test = require('./test')


test("/some/resource?$top=5&$skip=100", "OData", function(result) {
  it("top should be specified", function() {
     assert.equal(result.options.$top, 5)
  })
  it("skip should be specified", function() {
     assert.equal(result.options.$skip, 100)
  })
})

test("/some/resource?$inlinecount=allpages", "OData", function(result) {
  it("inline should be specified", function() {
     assert.equal(result.options.$inlinecount, "allpages")
  })
})

test("/some/resource?$inlinecount=none", "OData", function(result) {
  it("inline should be specified", function() {
     assert.equal(result.options.$inlinecount, "none")
  })
})

test("/some/resource?$inlinecount=flibble", "OData", function(result) {
  it("inline should be specified", function() {
     assert.equal(result.options.$inlinecount, "")
  })
})
