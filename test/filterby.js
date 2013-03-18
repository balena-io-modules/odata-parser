var assert = require('assert')
  , test = require('./test')


function operandTest(op) {
  test("/some/resource?$filterby=Foo " + op + " 2", "OData", function(result) {
    it("A filter should be present", function() {
       assert.notEqual(result.options.$filterby, null)
    })
    it("Filter should be an instance of '" + op + "'", function() {
       assert.equal(result.options.$filterby[0], op)
    })
    it("lhr should be Foo", function() {
       assert.equal(result.options.$filterby[1].name, "Foo")
    })
    it("rhr should be 2", function() {
       assert.equal(result.options.$filterby[2], 2)
    })
  })
}
operandTest("eq")
operandTest("ne")
operandTest("gt")
operandTest("lt")
operandTest("le")

test("/some/resource?$filterby=Foo eq 'bar'", "OData", function(result) {
  it("A filter should be present", function() {
     assert.notEqual(result.options.$filterby, null)
  })
  it("Filter should be an instance of 'eq'", function() {
     assert.equal(result.options.$filterby[0], "eq")
  })
  it("lhr should be Foo", function() {
     assert.equal(result.options.$filterby[1].name, "Foo")
  })
  it("rhr should be 2", function() {
     assert.equal(result.options.$filterby[2], 'bar')
  })
})
