var test = require('./test')
  , assert = require('assert')

test("/Categories?$expand=Products/Suppliers", "OData",  function(result) {
  it("has an $expand value", function() {
    assert.notEqual(result.options.$expand, null)
  })
  it("has a resource of Products", function() {
    assert.equal(result.options.$expand.properties[0].name, "Products")
  })
  it("has a child path of Suppliers", function() {
      assert.equal(result.options.$expand.properties[0].property.name, "Suppliers")
  })
})

test("/Categories?$expand=Products,Suppliers", "OData", function(result) {
  it("has an $expand value", function() {
    assert.notEqual(result.options.$expand, null)
  })
  it("has a resource of Products", function() {
    assert.equal(result.options.$expand.properties[0].name, "Products")
  })
  it("has a resource of Suppliers", function() {
      assert.equal(result.options.$expand.properties[1].name, "Suppliers")

  })
})


