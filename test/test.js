require('ometa-js')
var ODataParser = require('../odata.ometajs').ODataParser

module.exports = function(input, entry, expectation) {
  describe("Parsing " + input, function() {
    var parser = ODataParser.createInstance()
      , result = null
    try {
      result = parser.matchAll(input, entry)
      expectation(result)
    }
    catch(e) {
      expectation(e)
    }
  });
}
