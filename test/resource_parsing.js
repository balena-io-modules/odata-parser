var assert = require('assert')
  , test = require('./test')

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

test("/model/child", "OData", function(result) {
  it("should have the resource specified", function() {
    assert(result instanceof SyntaxError)
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
  it("should have the key specified for the resource", function() {
     assert.equal(result.key, '1')
  })
  it("should have the child specified", function() {
     assert.equal(result.property.resource, 'child')
  })
})
  
test("/model(1)/$links/Child", "OData", function(result) {
  it("should have the resource specified", function() {
     assert.equal(result.resource, 'model')
  })
  it("should have the key specified for the resource", function() {
     assert.equal(result.key, '1')
  })

  it("should have the link specified", function() {
     assert.equal(result.link.resource, 'Child')
  })
})


test("/method(1)/child?foo=bar", "OData", function(result) {
  it("should have the resource specified", function() {
     assert.equal(result.resource, 'method')
  })
  it("The result should be addressed", function() {
     assert.equal(result.key, '1')
  })

  it("should have the path specified", function() {
     assert.equal(result.property.resource, 'child')
  })

  it("should have the argument specified", function() {
     assert.equal(result.options.foo, 'bar')
  })
})

