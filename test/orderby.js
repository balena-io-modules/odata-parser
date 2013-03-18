var assert = require('assert')
  , test = require('./test')

test("/resource?$orderby=Property", "OData", function(result) {
  it("sort options are present on the result", function() {
     assert.notEqual(result.options.$orderby, null)
  })
  it("sort options have the property specified", function() {
     assert.equal(result.options.$orderby.properties[0].name, "Property")
  })
})

test("/resource?$orderby=PropertyOne,PropertyTwo", "OData", function(result) {
  it("sort options are present on the result", function() {
     assert.notEqual(result.options.$orderby, null)
  })
  it("sort options have the first property specified", function() {
     assert.equal(result.options.$orderby.properties[0].name, "PropertyOne")
  })
  it("sort options have the second property specified", function() {
     assert.equal(result.options.$orderby.properties[1].name, "PropertyTwo")
  })
})


test("/resource?$orderby=PropertyOne desc", "OData", function(result) {
  it("sort options are present on the result", function() {
     assert.notEqual(result.options.$orderby, null)
  })
  it("sort options have the property specified", function() {
     assert.equal(result.options.$orderby.properties[0].name, "PropertyOne")
  })
  it("sort options have the property ordering specified", function() {
     assert.equal(result.options.$orderby.properties[0].order, "desc")
  })
})


test("/resource?$orderby=PropertyOne asc", "OData", function(result) {
  it("sort options are present on the result", function() {
     assert.notEqual(result.options.$orderby, null)
  })
  it("sort options have the property specified", function() {
     assert.equal(result.options.$orderby.properties[0].name, "PropertyOne")
  })
  it("sort options have the property ordering specified", function() {
     assert.equal(result.options.$orderby.properties[0].order, "asc")
  })
})

test("/resource?$orderby=PropertyOne asc,PropertyTwo desc", "OData", function(result) {
  it("sort options are present on the result", function() {
     assert.notEqual(result.options.$orderby, null)
  })
  it("sort options have property one name specified", function() {
     assert.equal(result.options.$orderby.properties[0].name, "PropertyOne")
  })
  it("sort options have property one ordering specified", function() {
     assert.equal(result.options.$orderby.properties[0].order, "asc")
  })
  it("sort options have the property two name specified", function() {
     assert.equal(result.options.$orderby.properties[1].name, "PropertyTwo")
  })
  it("sort options have the property two ordering specified", function() {
     assert.equal(result.options.$orderby.properties[1].order, "desc")
  })
})

test("/resource?$orderby=PropertyOne/SubProperty", "OData", function(result) {
  it("sort options are present on the result", function() {
     assert.notEqual(result.options.$orderby, null)
  })
  it("sort options have property one name specified", function() {
     assert.equal(result.options.$orderby.properties[0].name, "PropertyOne")
  })
  it("sort options have property one's sub property specified", function() {
     assert.equal(result.options.$orderby.properties[0].property.name, "SubProperty")
  })
})







