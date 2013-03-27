require('ometa-js')
var ODataParser = require('../odata-parser.ometajs').ODataParser,
    parser = ODataParser.createInstance();

module.exports = function(input, entry, expectation) {
  describe("Parsing " + input, function() {
    var result;
    try {
      result = parser.matchAll(input, entry);
      expectation(result);
    }
    catch(e) {
      expectation(e);
    }
  });
};
