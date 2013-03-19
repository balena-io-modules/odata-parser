var test = require('./test')
  , assert = require('assert')

test("/Categories?$select=category/person", "OData", function(result) {
  it("has a $select value", function() {
    assert.notEqual(result.options.$select,null)
  })
  it("resource is category", function() {
      assert.equal(result.options.$select.properties[0].name, "category")
  })
  it("property is person", function() {
      assert.equal(result.options.$select.properties[0].property.name, "person")
  })
})

test("/Categories?$select=category/person,animal", "OData", function(result) {
  it("has a $select value", function() {
    assert.notEqual(result.options.$select,null)
  })
  it("resource is category", function() {
      assert.equal(result.options.$select.properties[0].name, "category")
  })
  it("property is person", function() {
      assert.equal(result.options.$select.properties[0].property.name, "person")
  })
  it("resource has animal", function() {
      assert.equal(result.options.$select.properties[1].name, "animal")
  })
})

test("/Categories?$select=*", "OData", function(result) {
  it("has a $select value", function() {
    assert.notEqual(result.options.$select,null)
  })
  it("property name is *", function() {
      assert.equal(result.options.$select, "*")
  })
})
