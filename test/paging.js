var assert = require('assert')
, test = require('./test')


test("/resource?$top=5&$skip=100", "OData", function(result) {
  it("top should be specified", function() {
     assert.equal(result.options.$top, 5)
  })
  it("skip should be specified", function() {
     assert.equal(result.options.$skip, 100)
  })
})

test("/resource?$inlinecount=allpages", "OData", function(result) {
  it("inline should be specified", function() {
     assert.equal(result.options.$inlinecount, "allpages")
  })
})

test("/resource?$inlinecount=none", "OData", function(result) {
  it("inline should be specified", function() {
     assert.equal(result.options.$inlinecount, "none")
  })
})

test("/resource?$inlinecount=flibble", "OData", function(result) {
  it("inline should be specified", function() {
     assert.equal(result.options.$inlinecount, "")
  })
})
