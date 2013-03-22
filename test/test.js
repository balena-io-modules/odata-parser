require('ometa-js')
var ODataParser = require('../odata.ometajs').ODataParser

module.exports = function(input, entry, expectation) {
  describe("Parsing " + input, function() {
    var parser = ODataParser.createInstance()
      , result = null
    result = parser.matchAll(input, entry)

    // I had error code here, might add it for
    // negative testing later
    expectation(result) 
  });
}
