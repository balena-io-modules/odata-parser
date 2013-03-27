var assert = require('assert')
  , test = require('./test')


function operandTest(op) {
  test("/resource?$filterby=Foo " + op + " 2", "OData", function(result) {
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
operandTest("ge")
operandTest("lt")
operandTest("le")

test("/resource?$filterby=Foo eq 'bar'", "OData", function(result) {
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

test("/resource?$filterby=Foo eq 2.5", "OData", function(result) {
  it("A filter should be present", function() {
     assert.notEqual(result.options.$filterby, null)
  })
  it("Filter should be an instance of 'eq'", function() {
     assert.equal(result.options.$filterby[0], "eq")
  })
  it("lhr should be Foo", function() {
     assert.equal(result.options.$filterby[1].name, "Foo")
  })
  it("rhr should be 2.5", function() {
     assert.equal(result.options.$filterby[2], 2.5)
  })
})

test("/resource?$filterby=Price gt 5 and Price lt 10", "OData", function(result) {

  it("A filter should be present", function() {
     assert.notEqual(result.options.$filterby, null)
  })
  it("Filter should be an instance of 'and'", function() {
     assert.equal(result.options.$filterby[0], "and")
  })

  it("Left hand side should be Price gt 5", function() {
     var lhs = result.options.$filterby[1] 
     assert.equal(lhs[0], "gt")
     assert.equal(lhs[1].name, "Price")
     assert.equal(lhs[2], 5)
  })

  it("Right hand side should be less than 10", function() {
     var rhs = result.options.$filterby[2] 
     assert.equal(rhs[0], "lt")
     assert.equal(rhs[1].name, "Price")
     assert.equal(rhs[2], 10)
  })
})

test("/resource?$filterby=Price eq 5 or Price eq 10", "OData", function(result) {

  it("A filter should be present", function() {
     assert.notEqual(result.options.$filterby, null)
  })
  it("Filter should be an instance of 'or'", function() {
     assert.equal(result.options.$filterby[0], "or")
  })

  it("Left hand side should be Price eq 5", function() {
     var lhs = result.options.$filterby[1] 
     assert.equal(lhs[0], "eq")
     assert.equal(lhs[1].name, "Price")
     assert.equal(lhs[2], 5)
  })

  it("Right hand side should be less than 10", function() {
     var rhs = result.options.$filterby[2] 
     assert.equal(rhs[0], "eq")
     assert.equal(rhs[1].name, "Price")
     assert.equal(rhs[2], 10)
  })
})

test("/resource?$filterby=not Published", "OData", function(result) {

  it("A filter should be present", function() {
     assert.notEqual(result.options.$filterby, null)
  })
  it("Filter should be an instance of 'not'", function() {
     assert.equal(result.options.$filterby[0], "not")
  })

  it("value should be 'Published'", function() {
    assert.equal(result.options.$filterby[1].name, "Published")
  })
})

test("/resource?$filterby=not (Price gt 5)", "OData", function(result) {

  it("A filter should be present", function() {
     assert.notEqual(result.options.$filterby, null)
  })
  it("Filter should be an instance of 'not'", function() {
     assert.equal(result.options.$filterby[0], "not")
  })
  it("Value should be Price gt 5", function() {
     var rhs = result.options.$filterby[1] 
     assert.equal(rhs[0], "gt")
     assert.equal(rhs[1].name, "Price")
     assert.equal(rhs[2], 5)
  })
})

test("/resource?$filterby=Price add 5 gt 10", "OData", function(result) {

  it("A filter should be present", function() {
     assert.notEqual(result.options.$filterby, null)
  })
  it("Filter should be an instance of 'gt'", function() {
     assert.equal(result.options.$filterby[0], "gt")
  })
  it("lhr should be Price add 5", function() {
     var rhs = result.options.$filterby[1] 
     assert.equal(rhs[0], "add")
     assert.equal(rhs[1].name, "Price")
     assert.equal(rhs[2], 5)
  })
  it("rhr should be 10", function() {
     assert.equal(result.options.$filterby[2], 10)
  })
})

test("/resource?$filterby=Price mul 5 gt 10", "OData", function(result) {

  it("A filter should be present", function() {
     assert.notEqual(result.options.$filterby, null)
  })
  it("Filter should be an instance of 'gt'", function() {
     assert.equal(result.options.$filterby[0], "gt")
  })
  it("lhr should be Price add 5", function() {
     var lhs = result.options.$filterby[1] 
     assert.equal(lhs[0], "mul")
     assert.equal(lhs[1].name, "Price")
     assert.equal(lhs[2], 5)
  })
  it("rhr should be 10", function() {
     assert.equal(result.options.$filterby[2], 10)
  })
})

test("/resource?$filterby=Price div Price mul 5 gt 10", "OData", function(result) {
  it("A filter should be present", function() {
     assert.notEqual(result.options.$filterby, null)
  })
  it("Filter should be an instance of 'gt'", function() {
     assert.equal(result.options.$filterby[0], "gt")
  })
  var lexpr = result.options.$filterby[1] 

  it("should be Price div {expr}", function() {
    assert.equal(lexpr[0], "div")
    assert.equal(lexpr[1].name, "Price")
  })

  it("should be Price mul 5", function() {
    assert.equal(lexpr[2][0], "mul")
    assert.equal(lexpr[2][1].name, "Price")
    assert.equal(lexpr[2][2], 5)
  })

  it("rhr should be 10", function() {
     assert.equal(result.options.$filterby[2], 10)
  })
})

test("/resource?$filterby=(Price div Price) mul 5 gt 10", "OData", function(result) {
  it("A filter should be present", function() {
     assert.notEqual(result.options.$filterby, null)
  })
  it("Filter should be an instance of 'gt'", function() {
     assert.equal(result.options.$filterby[0], "gt")
  })
  var lexpr = result.options.$filterby[1] 

  it("should be {expr} mul 5", function() {
    assert.equal(lexpr[0], "mul")
    assert.equal(lexpr[2], 5)
  })

  it("should be {Price div Price}", function() {
    assert.equal(lexpr[1][0], "div")
    assert.equal(lexpr[1][1].name, "Price")
    assert.equal(lexpr[1][2].name, "Price" )
  })

  it("rhr should be 10", function() {
     assert.equal(result.options.$filterby[2], 10)
  })
})

methodTestWithTwoArgs("substringof")
methodTestWithTwoArgs("endswith")
methodTestWithTwoArgs("startswith")
methodTestWithOneArg("length")
methodTestWithTwoArgs("indexof")
methodTestWithThreeArgs("replace")
methodTestWithTwoArgs("substring")
methodTestWithThreeArgs("substring")
methodTestWithOneArg("tolower")
methodTestWithOneArg("toupper")
methodTestWithOneArg("trim")
methodTestWithOneArg("concat")
methodTestWithTwoArgs("day")
methodTestWithOneArg("hour")
methodTestWithOneArg("minute")
methodTestWithOneArg("month")
methodTestWithOneArg("second")
methodTestWithOneArg("year")
methodTestWithOneArg("round")
methodTestWithOneArg("floor")
methodTestWithOneArg("ceiling")
methodTestWithOneArg("isof")
methodTestWithTwoArgs("isof")

/* Not sure about whether I want this or not - up to you but it's here
methodTestWithThreeArgs("substringof", true)
methodTestWithThreeArgs("endswith", true)
methodTestWithThreeArgs("startswith", true)
methodTestWithTwoArgs("length", true)
methodTestWithThreeArgs("indexof", true)
*/

function methodTestWithThreeArgs(methodName, expectFailure) {
  test("/resource?$filterby=" + methodName + "('alfred', Product, 2) eq 'cake'", "OData", function(result, err) {
    if(expectFailure)
      it("Should fail because it's invalid", function() {
        assert.notEqual(err, null)
      })
    else if(err)
      throw err
    it("A filter should be present", function() {
       assert.notEqual(result.options.$filterby, null)
    })
    it("Filter should be an instance of 'eq'", function() {
       assert.equal(result.options.$filterby[0], "eq")
    })
    it("lhs should be a function call", function() {
       assert.equal(result.options.$filterby[1][0], "call")
    })
    it("lhs should be " + methodName + " with correct args", function() {
       assert.equal(result.options.$filterby[1][1].method, methodName)
       assert.equal(result.options.$filterby[1][1].args[0], 'alfred')
       assert.equal(result.options.$filterby[1][1].args[1].name, 'Product')
       assert.equal(result.options.$filterby[1][1].args[2],2)
    })
    it("rhs should be cake", function() {
       assert.equal(result.options.$filterby[2], "cake")
    }) 
  })
}

function methodTestWithTwoArgs(methodName, expectFailure) {
  test("/resource?$filterby=" + methodName + "('alfred', Product) eq 'cake'", "OData", function(result, err) {
    if(expectFailure)
      it("Should fail because it's invalid", function() {
        assert.notEqual(err, null)
      })
    else if(err)
      throw err
    it("A filter should be present", function() {
       assert.notEqual(result.options.$filterby, null)
    })
    it("Filter should be an instance of 'eq'", function() {
       assert.equal(result.options.$filterby[0], "eq")
    })
    it("lhs should be a function call", function() {
       assert.equal(result.options.$filterby[1][0], "call")
    })
    it("lhs should be " + methodName + " with correct args", function() {
       assert.equal(result.options.$filterby[1][1].method, methodName)
       assert.equal(result.options.$filterby[1][1].args[0], 'alfred')
       assert.equal(result.options.$filterby[1][1].args[1].name, 'Product')
    })
    it("rhs should be cake", function() {
       assert.equal(result.options.$filterby[2], "cake")
    }) 
  })
}

function methodTestWithOneArg(methodName, expectFailure) {
  test("/resource?$filterby=" + methodName + "('alfred') eq 'cake'", "OData", function(result, err) {
    if(expectFailure)
      it("Should fail because it's invalid", function() {
        assert.notEqual(err, null)
      })
    else if(err)
      throw err
    it("A filter should be present", function() {
       assert.notEqual(result.options.$filterby, null)
    })
    it("Filter should be an instance of 'eq'", function() {
       assert.equal(result.options.$filterby[0], "eq")
    })
    it("lhs should be a function call", function() {
       assert.equal(result.options.$filterby[1][0], "call")
    })
    it("lhs should be " + methodName + " with correct args", function() {
       assert.equal(result.options.$filterby[1][1].method, methodName)
       assert.equal(result.options.$filterby[1][1].args[0], 'alfred')
    })
    it("rhs should be cake", function() {
       assert.equal(result.options.$filterby[2], "cake")
    }) 
  })
}

